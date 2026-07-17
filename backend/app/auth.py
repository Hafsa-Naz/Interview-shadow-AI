"""Firebase ID-token verification and user synchronisation."""
import os
from dataclasses import dataclass

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User

bearer_scheme = HTTPBearer(auto_error=False)


@dataclass(frozen=True)
class CurrentUser:
    uid: str
    email: str | None = None
    display_name: str | None = None


def _firebase_enabled() -> bool:
    return os.getenv("FIREBASE_AUTH_REQUIRED", "false").lower() == "true"


def _firebase_app():
    try:
        import firebase_admin
        from firebase_admin import credentials
    except ImportError as exc:
        raise RuntimeError("Firebase Admin SDK is not installed; run pip install -r requirements.txt") from exc
    if firebase_admin._apps:
        return firebase_admin.get_app()
    service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")
    credential = credentials.Certificate(service_account_path) if service_account_path else credentials.ApplicationDefault()
    return firebase_admin.initialize_app(credential)


def current_user(
    token: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> CurrentUser | None:
    """Return a verified Firebase user, or None when auth is deliberately disabled locally."""
    if not _firebase_enabled():
        return None
    if token is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="A Firebase ID token is required")
    try:
        from firebase_admin import auth as firebase_auth
        claims = firebase_auth.verify_id_token(token.credentials, app=_firebase_app())
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired Firebase ID token") from exc
    user = CurrentUser(uid=claims["uid"], email=claims.get("email"), display_name=claims.get("name"))
    stored = db.get(User, user.uid)
    if stored is None:
        db.add(User(id=user.uid, email=user.email, display_name=user.display_name))
    else:
        stored.email, stored.display_name = user.email, user.display_name
    db.commit()
    return user

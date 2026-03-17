"""add user role

Revision ID: 5665ba7d2bd4
Revises: 1757c1f3b4b5
Create Date: 2026-02-28 14:42:25.352826

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql



# revision identifiers, used by Alembic.
revision: str = '5665ba7d2bd4'
down_revision: Union[str, Sequence[str], None] = '1757c1f3b4b5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    # Create ENUM type first
    userrole_enum = postgresql.ENUM(
        "USER",
        "ADMIN",
        name="userrole",
    )
    userrole_enum.create(op.get_bind())

    # Add column with default (important if users table has data)
    op.add_column(
        "users",
        sa.Column(
            "role",
            userrole_enum,
            nullable=False,
            server_default="USER"
        ),
    )

    # Remove default after creation (clean approach)
    op.alter_column("users", "role", server_default=None)

    # Existing constraint
    op.create_unique_constraint(
        'unique_review_per_user',
        'reviews',
        ['exchange_id', 'reviewer_id']
    )



def downgrade() -> None:
    """Downgrade schema."""

    op.drop_constraint(
        'unique_review_per_user',
        'reviews',
        type_='unique'
    )

    op.drop_column('users', 'role')

    # Drop ENUM type
    userrole_enum = postgresql.ENUM(
        "USER",
        "ADMIN",
        name="userrole",
    )
    userrole_enum.drop(op.get_bind())


from marshmallow import fields
from app import db, ma

#this is a many to many relationship to the cats
class TransCategory(db.Model):
    __tablename__ = 'transaction_categories'
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(40), unique=True, nullable=False)


class TransCategorySchema(ma.ModelSchema):
    class Meta:
        model = TransCategory
    #this causes a recursion error, so we need to exclude categories (its self) so that the transaction and category schemas dont continually refer back to each other and include an infinite list of each other. Here, we've only included the id and name of the category
    transactions = fields.Nested('TransactionSchema', many=True, only=('id', 'description'))

# JOIN DEFINITION to TRANSACTIONS
# this is a many to many relationship so is created differently to a one to many relationship like comments
transactions_to_categories = db.Table(
    'transactions_to_categories',
    db.Column('transaction_id', db.Integer, db.ForeignKey('transactions.id')),
    db.Column('transaction_category_id', db.Integer, db.ForeignKey('transaction_categories.id'))
)

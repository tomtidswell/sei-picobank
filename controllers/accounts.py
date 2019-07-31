from flask import Blueprint, jsonify, request, g
from app import db
from models.account import Account, AccountSchema, Transaction, TransactionSchema
from models.transaction_category import TransCategory, TransCategorySchema
from models.user import User, UserSchema
from lib.secure_route import secure_route
from lib.generate_transactions \
    import add_transactions_rnd, add_transactions_bills#, add_transactions_income, acc_transfer


api = Blueprint('accounts', __name__)
user_schema = UserSchema(exclude=('password', 'id', 'updated_at', 'messages'))
account_schema = AccountSchema(exclude=('transactions',))
transaction_schema = TransactionSchema(exclude=('account', 'created_at', 'updated_at'))
transaction_schema_expanded = TransactionSchema()
trans_cat_schema = TransCategorySchema()


# this is included for debugging purposes, and should be commented out before deployment
@api.route('/accounts', methods=['GET'])
def accIndex():
    accounts = Account.query.all()
    return account_schema.jsonify(accounts, many=True), 200

# in this route, we pretend that we are looking for an existing account. What we actually do is create one if the user has fewer than 3 accounts already
@api.route('/accounts/link', methods=['GET'])
@secure_route
def link():
    user = g.current_user

    # if the user has fewer than 3 accounts, pretend we found it and linked it, and actually create it
    if len(user.accounts) < 30:
        account_data = Account(type="Current Account", owner_id=user.id)
        cat_data = TransCategory.query.all()
        new_trans = add_transactions_rnd(
            account=account_data, categories=cat_data, number={"small":10, "medium":5, "large":3}, days=92)
        new_trans.extend(add_transactions_bills(
            account=account_data, categories=cat_data, bills=True, days=92))
        
        print(new_trans)

        for trans in new_trans:
            db.session.add(trans)
    
        db.session.add(account_data)
        db.session.commit()

        # get the refreshed user data
        user = User.query.get(user.id)

        return user_schema.jsonify(user, many=False), 201

    # otherwise we pretend we cant find it
    return jsonify({'message': 'not found'}), 404


@api.route('/accounts/<int:account_id>', methods=['GET'])
@secure_route
def show(account_id):
    account = Account.query.get(account_id)
    if not account:
        return jsonify({'message': 'not found'}), 404
    return account_schema.jsonify(account), 200


@api.route('/accounts/<int:account_id>/transactions', methods=['GET'])
@secure_route
def show_transactions(account_id):
    account = Transaction.query \
        .order_by(Transaction.date) \
        .filter(Transaction.account_id == account_id).all()
    if not account:
        return jsonify([]), 200
    return transaction_schema.jsonify(account, many=True), 200


# @api.route('/cats/<int:cat_id>', methods=['PUT'])
# @secure_route
# def update(cat_id):
#     cat = Cat.query.get(cat_id)
#     if not cat:
#         return jsonify({'message': 'Not Found'}), 404
#     if cat.creator != g.current_user:
#         return jsonify({'message': 'Unauthorized'})
#     data = request.get_json()
#     errors = {}
#     if not is_unique(model=Cat, key='name', value=data.get('name')):
#         errors['name'] = errors.get('name', []) + ['Cat name already taken']
#         return jsonify(errors), 422
#     cat, errors = cat_schema.load(data, instance=cat, partial=True)
#     if errors:
#         return jsonify(errors), 422
#     cat.save()
#     return cat_schema.jsonify(cat), 202

from flask import Blueprint, jsonify, request, g
from models.account import Account, AccountSchema, Transaction, TransactionSchema
from models.user import User, UserSchema
# from lib.secure_route import secure_route


api = Blueprint('accounts', __name__)
account_schema = AccountSchema(exclude=('transactions',))
# this expanded schema isnt used, but could be to expand the payload sent
# account_schema_expanded = AccountSchema()
transaction_schema = TransactionSchema(exclude=('account', 'created_at', 'updated_at'))


@api.route('/accounts', methods=['GET'])
def accIndex():
    # redefine the account schema so that we exclude the transactions when we are looking at the index - this will improve performance
    accounts = Account.query.all()
    return account_schema.jsonify(accounts, many=True), 200


@api.route('/accounts/<int:account_id>', methods=['GET'])
def show(account_id):
    account = Account.query.get(account_id)
    if not account:
        return jsonify({'message': 'not found'}), 404
    return account_schema.jsonify(account), 200


@api.route('/accounts/<int:account_id>/transactions', methods=['GET'])
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

from flask import Blueprint, jsonify, request, g
from models.account import Account, AccountSchema, Transaction, TransactionSchema
from models.user import User, UserSchema
from lib.secure_route import secure_route
from lib.create_account \
    import add_transactions_rnd #, add_transactions_bills, add_transactions_income, acc_transfer, categories


api = Blueprint('accounts', __name__)
account_schema = AccountSchema(exclude=('transactions',))
# this expanded schema isnt used, but could be to expand the payload sent
# account_schema_expanded = AccountSchema()
transaction_schema = TransactionSchema(exclude=('account', 'created_at', 'updated_at'))
transaction_schema_expanded = TransactionSchema()


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
    if len(user.accounts) < 3:
        print('create an account')

        # attempt using schema
        account_data = {"type": "Current Account", "owner_id": user.id}
        new_account, errors = account_schema.load(account_data)
        print('account errors:', errors)

        print('new account:', new_account)
        new_account.owner_id = user.id
        # attempt using object
        # new_account = Account(type='Current Account', owner=user.id)

        # now add the transactions for the account
        new_trans = add_transactions_rnd(account=account_data, n_small=10, days=92)
        for x in new_trans:
            new_transaction, errors = transaction_schema_expanded.load(x)
            print(new_transaction)
            print(errors)

            new_account.transactions.append(new_transaction)
        # new_account.transactions.append(new_transactions)

        new_account.save()
        # seed()

        # print('new trans:', new_trans)
        # print('new transactions:', new_transactions)
        # print('transaction errors:', errors)


        return jsonify({'success': 'we created it!'}), 201

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

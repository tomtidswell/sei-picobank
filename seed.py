from app import app, db
from models.account import Account, Transaction
from models.transaction_category import TransCategory
from db.seed_users import users
from db.seed_transactions \
    import add_transactions_rnd, add_transactions_bills, add_transactions_income, acc_transfer, categories
#above, we're importing the Account  models to access the database directly, but for the user, because it includes virtual fields, we access the database via the schema so we can make use of the virtual field functionality



with app.app_context():
    db.drop_all()
    db.create_all()

    accounts = [
        Account(type='Current Account', owner=users[1]),
        Account(type='Current Account', owner=users[1]),
        Account(type='Credit Card', owner=users[1]),
        Account(type='Mortgage', owner=users[1]),
        Account(type='Current Account', owner=users[0]),
        Account(type='Credit Card', owner=users[0]),
    ]

    # small medium and large transactions - a number of random items
    add_transactions_rnd(account=accounts[0], n_small=10, n_medium=3, days=92)
    add_transactions_bills(account=accounts[0], bills=True, days=92)
    add_transactions_income(account=accounts[0], salary=True, n_medium=2, days=92)

    add_transactions_bills(account=accounts[1], bills=True, days=30)

    add_transactions_rnd(account=accounts[2], n_medium=5, n_large=3, days=60)

    acc_transfer(acc_from=accounts[0], acc_to=accounts[2], verb='Payment', days=10)
    acc_transfer(acc_from=accounts[0], acc_to=accounts[2], verb='Payment', days=40)


    # categories (only need to add categories that havent been used yet)
    for category in categories.values():
        db.session.add(category)

    # users - add_all to add a list of users
    db.session.add_all(users)

    #owned accounts - again, uses add_all
    db.session.add_all(accounts)

    # unclaimed accounts
    # db.session.add(anon_account)

    db.session.commit()

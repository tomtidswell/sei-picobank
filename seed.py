from app import app, db
from models.account import Account, Transaction
from models.transaction_category import TransCategory
from db.seed_users import users
#above, we're importing the Account  models to access the database directly, but for the user, because it includes virtual fields, we access the database via the schema so we can make use of the virtual field functionality



with app.app_context():
    db.drop_all()
    db.create_all()

    categories = dict(
        shopping=TransCategory(category='Shopping'),
        supermarket=TransCategory(category='Supermarket'),
        eating_out=TransCategory(category='Eating Out'),
        bill=TransCategory(category='Bill'),
        mortgage=TransCategory(category='Mortgage Payment')
    )

    accounts = (
        Account(type='Current', owner=users[0]),
        Account(type='Current', owner=users[1]),
        Account(type='Current', owner=users[1]),
        Account(type='Credit Card', owner=users[1]),
        Account(type='Mortgage', owner=users[1])
    )

    anon_account = Account(type='Current')

    transaction1 = Transaction(
        description='Tesco supermarket', date='2019-07-22', amount=12.99, account=accounts[1], categories=[categories['shopping'], categories['supermarket']]
    )
    transaction2 = Transaction(
        description='o2 Mobile Direct Debit', date='2019-07-20', amount=24.99, account=accounts[1], categories=[categories['bill']]
    )

    # categories (only need to add categories that havent been used yet)
    for category in categories.values():
        db.session.add(category)

    # users - add_all to add a list of users
    db.session.add_all(users)

    #owned accounts - again, uses add_all
    db.session.add_all(accounts)

    # unclaimed accounts
    db.session.add(anon_account)

    db.session.commit()

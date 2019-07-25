from app import app, db
from models.account import Account, Transaction
from models.transaction_category import TransCategory
from db.seed_users import users
#above, we're importing the Account  models to access the database directly, but for the user, because it includes virtual fields, we access the database via the schema so we can make use of the virtual field functionality



with app.app_context():
    db.drop_all()
    db.create_all()

    categories = dict(
        shopping=TransCategory(category='Shopping', colour='#8ad7ff'),
        supermarket=TransCategory(category='Supermarket', colour='#b38aff'),
        eating_out=TransCategory(category='Eating Out', colour='#8affb2'),
        travel=TransCategory(category='Travel', colour='#ff8ad8'),
        bill=TransCategory(category='Bill', colour='#ff8a9c'),
        mortgage=TransCategory(category='Mortgage', colour='#ed8aff'),
        salary=TransCategory(category='Salary', colour='#d7ff8a'),
        incoming=TransCategory(category='Incoming Payment', colour='#ffb28a'),
        transfer=TransCategory(category='Money transfer', colour='#ffec8a')
    )


    accounts = (
        Account(type='Current Account', owner=users[0]),
        Account(type='Credit Card', owner=users[0]),
        Account(type='Mortgage', owner=users[0]),
        Account(type='Current Account', owner=users[1]),
        Account(type='Credit Card', owner=users[1]),
        Account(type='Mortgage', owner=users[1])
    )

    anon_account = Account(type='Current')

    transaction0 = Transaction(
        description='Tesco supermarket', date='2019-07-15', amount=-12.99, account=accounts[3], categories=[categories['shopping'], categories['supermarket']]
    )
    transaction1 = Transaction(
        description='Tesco supermarket', date='2019-07-24', amount=-8.45, account=accounts[3], categories=[categories['shopping'], categories['supermarket']]
    )
    transaction2 = Transaction(
        description='o2 Mobile Direct Debit', date='2019-07-20', amount=-24.99, account=accounts[3], categories=[categories['bill']]
    )
    transaction3 = Transaction(
        description='Mortgage payment', date='2019-07-05', amount=-480.00, account=accounts[3], categories=[categories['mortgage']]
    )
    transaction4 = Transaction(
        description='Salary', date='2019-07-03', amount=810.60, account=accounts[3], categories=[categories['salary']]
    )

    transaction5 = Transaction(
        description='Zara Oxford street', date='2019-07-20', amount=-84.99, account=accounts[5], categories=[categories['shopping']]
    )
    transaction6 = Transaction(
        description='Asos online', date='2019-07-05', amount=-130.99, account=accounts[5], categories=[categories['shopping']]
    )
    transaction7 = Transaction(
        description='Thomas Cook', date='2019-07-03', amount=-559.10, account=accounts[5], categories=[categories['travel']]
    )
    transaction8 = Transaction(
        description='Transfer from James T', date='2019-07-05', amount=200.00, account=accounts[3], categories=[categories['transfer']]
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

from app import new_app, db
from config.models import Account, TransCategory, Message
from db.seed_users import users
from db.seed_transactions \
    import add_transactions_rnd, add_transactions_bills, add_transactions_income, acc_transfer, categories


with new_app.app_context():
    db.drop_all()
    db.create_all()

    accounts = [
        Account(type='Current Account', owner=users[0]),
        Account(type='Credit Card', owner=users[0]),
        Account(type='Current Account', owner=users[1]),
        Account(type='Current Account', owner=users[1]),
        Account(type='Credit Card', owner=users[1]),
        Account(type='Mortgage', owner=users[1]),
    ]

    # USER 0
    # current account
    add_transactions_rnd(account=accounts[0], n_small=15, n_medium=10, days=92)
    add_transactions_bills(account=accounts[0], bills=True, days=92)
    add_transactions_income(account=accounts[0], salary=True, n_medium=2, days=92)
    
    # USER 1
    # current account 1
    add_transactions_rnd(account=accounts[2], n_small=20, n_medium=5, days=92)
    add_transactions_bills(account=accounts[2], bills=True, days=92)
    add_transactions_income(account=accounts[2], salary=True, n_medium=2, days=92)
    # current account to credit card
    acc_transfer(acc_from=accounts[2], acc_to=accounts[5], verb='Payment', days=10)
    acc_transfer(acc_from=accounts[2], acc_to=accounts[5], verb='Payment', days=40)
    # current account 2
    add_transactions_bills(account=accounts[3], bills=True, days=30)
    # credit card
    add_transactions_rnd(account=accounts[4], n_medium=5, n_large=3, days=60)


    Message(text='Hey, I have a problem with my account - I do not recognise something I see on my statement', owner=users[0], archived=False)

    Message(text='Could you please confirm which transaction you are referring to? Please reply with the date and description', owner=users[0], archived=False, incoming=True)
    
    Message(text='Hey, I have a problem with my account - I do not recognise something I see on my statement', owner=users[1], archived=False)

    Message(text='Could you please confirm which transaction you are referring to? Please reply with the date and description', owner=users[1], archived=False, incoming=True)



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

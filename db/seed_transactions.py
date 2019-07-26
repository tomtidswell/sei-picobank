import datetime
import random
from models.account import Transaction
from models.transaction_category import TransCategory

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

small_items = [
    {'desc': 'Tesco supermarket', 'cat': [categories['shopping'], categories['supermarket']]},
    {'desc': 'WM Morrisons', 'cat': [categories['shopping'], categories['supermarket']]},
    {'desc': 'Asda plc', 'cat': [categories['shopping'], categories['supermarket']]},
    {'desc': 'Waitrose supermarket', 'cat': [categories['shopping'], categories['supermarket']]},
    {'desc': 'Pret a Manger', 'cat': [categories['eating_out']]},
    {'desc': 'Itsu', 'cat': [categories['eating_out']]},
    {'desc': 'Starbucks', 'cat': [categories['eating_out']]},
    {'desc': 'Caffe Nero', 'cat': [categories['eating_out']]},
    {'desc': 'Transfer to J Smith', 'cat': [categories['transfer']]},
    {'desc': 'Transfer to P Aktar', 'cat': [categories['transfer']]},
    {'desc': 'Transfer to I Johnson', 'cat': [categories['transfer']]}
]

med_items = [
    {'desc': 'Zara Oxford street', 'cat': [categories['shopping']]},
    {'desc': 'Asos Online', 'cat': [categories['shopping']]},
    {'desc': 'Amazon EU SarL', 'cat': [categories['shopping']]},
    {'desc': 'Robert Dyas Ltd', 'cat': [categories['shopping']]},
    {'desc': 'John Lewis', 'cat': [categories['shopping']]},
    {'desc': 'B&Q ltd.', 'cat': [categories['shopping']]},
    {'desc': 'Transfer to S Tidswell', 'cat': [categories['transfer']]},
    {'desc': 'Transfer to A Golding', 'cat': [categories['transfer']]},
    {'desc': 'Transfer to G Folino', 'cat': [categories['transfer']]}
]

large_items = [
    {'desc': 'Thomas Cook', 'cat': [categories['travel']]},
    {'desc': 'AirBnB', 'cat': [categories['travel']]},
    {'desc': 'Expedia', 'cat': [categories['travel']]},
    {'desc': 'Tui Travel', 'cat': [categories['travel']]},
    {'desc': 'Ryanair', 'cat': [categories['travel']]},
    {'desc': 'British Airways', 'cat': [categories['travel']]},
    {'desc': 'Marriot International', 'cat': [categories['travel']]}
]

mobile_phones = [
    {'desc': 'o2 Mobile Direct Debit', 'cat': [categories['bill']]},
    {'desc': 'EE UK Ltd', 'cat': [categories['bill']]},
    {'desc': 'Vodafone', 'cat': [categories['bill']]}
]

accomodations = [
    {'desc': 'Santander UK Mortgage', 'cat': [categories['bill']]},
    {'desc': 'Rent Standing Order', 'cat': [categories['bill']]},
    {'desc': 'Halifax Mortgage', 'cat': [categories['bill']]}
]

councils = [
    {'desc': 'Westminster Council Tax', 'cat': [categories['bill']]},
    {'desc': 'Lambeth Council Tax', 'cat': [categories['bill']]},
    {'desc': 'Tower Hamlets Council Tax', 'cat': [categories['bill']]},
    {'desc': 'Leeds Council Tax', 'cat': [categories['bill']]},
    {'desc': 'Bradford Council Tax', 'cat': [categories['bill']]}
]

energy_providers = [
    {'desc': 'npower Direct Debit', 'cat': [categories['bill']]},
    {'desc': 'Scottish Power', 'cat': [categories['bill']]},
    {'desc': 'Bulb Energy', 'cat': [categories['bill']]},
    {'desc': 'eon Direct Debit', 'cat': [categories['bill']]},
    {'desc': 'British Gas', 'cat': [categories['bill']]}
]

med_inc_items = [
    {'desc': 'Transfer from S Atyam', 'cat': [categories['incoming']]},
    {'desc': 'Transfer from S Laygreaves', 'cat': [categories['incoming']]},
    {'desc': 'Transfer from U Ali', 'cat': [categories['incoming']]},
    {'desc': 'Transfer from K McLindon', 'cat': [categories['incoming']]},
    {'desc': 'Refund from Asos Online', 'cat': [categories['incoming']]}
]


# quantity corresponds to small, medium and large purchases in that order in a list
def add_transactions_rnd(account, days, n_small=0, n_medium=0, n_large=0):

    now = datetime.datetime.now()
    return_transactions = []

    # build the small random transactions
    for i in range(n_small):
        # create a timedelta based on a random day in the range between 0 and the inputted days
        delta = datetime.timedelta(days=random.randrange(0, days))
        # choose a random small item
        item = small_items[random.randrange(0, len(small_items)-1)]
        return_transactions.append(
            Transaction(
                description=item['desc'],
                date=now-delta,
                amount=- random.randrange(1, 15) + random.randrange(0, 100) / 100,
                account=account,
                categories=item['cat']
            )
        )


    # build the medium random transactions
    for i in range(n_medium):
        # create a timedelta based on a random day in the range between 0 and the inputted days
        delta = datetime.timedelta(days=random.randrange(0, days))
        # choose a random small item
        item = med_items[random.randrange(0, len(med_items)-1)]
        return_transactions.append(
            Transaction(
                description=item['desc'],
                date=now-delta,
                amount=- random.randrange(20, 200) + random.randrange(0, 100) / 100,
                account=account,
                categories=item['cat']
            )
        )


    # build the large random transactions
    for i in range(n_large):
        # create a timedelta based on a random day in the range between 0 and the inputted days
        delta = datetime.timedelta(days=random.randrange(0, days))
        # choose a random small item
        item = large_items[random.randrange(0, len(large_items)-1)]
        return_transactions.append(
            Transaction(
                description=item['desc'],
                date=now-delta,
                amount=- random.randrange(100, 400) + random.randrange(0, 100) / 100,
                account=account,
                categories=item['cat']
            )
        )

    return return_transactions


# quantity corresponds to small, medium and large purchases in that order in a list
def add_transactions_income(account, days, salary=False, n_medium=0):

    now = datetime.datetime.now()
    return_transactions = []


    # build the medium random transactions
    for i in range(n_medium):
        # create a timedelta based on a random day in the range between 0 and the inputted days
        delta = datetime.timedelta(days=random.randrange(0, days))
        # choose a random small item
        item = med_inc_items[random.randrange(0, len(med_inc_items)-1)]
        return_transactions.append(
            Transaction(
                description=item['desc'],
                date=now-delta,
                amount=random.randrange(20, 150) + random.randrange(0, 100) / 100,
                account=account,
                categories=item['cat']
            )
        )

    if days >= 30 and salary:
        # get an offset
        offset = random.randrange(5, 30)
        amount = random.randrange(1000, 3000) + random.randrange(0, 100) / 100

        # now loop through each 30 day period
        for i in range(round(days/30)):
            # work out the deltas
            delta = datetime.timedelta(weeks=i*4, days=offset)

            # append the mobile provider
            return_transactions.append(
                Transaction(
                    description='Salary',
                    date=now-delta,
                    amount=amount,
                    account=account,
                    categories=[categories['salary']]
                )
            )


    return return_transactions



def add_transactions_bills(account, days, bills=False):

    now = datetime.datetime.now()
    return_transactions = []

    if days >= 30 and bills:
        # make the bills at least 5 days ago
        mob_offset = random.randrange(5, 30)
        counc_offset = random.randrange(5, 30)
        accom_offset = random.randrange(5, 30)
        energy_offset = random.randrange(5, 30)

        # choose a provider for each bill
        mob = mobile_phones[random.randrange(0, len(mobile_phones)-1)]
        counc = councils[random.randrange(0, len(councils)-1)]
        accom = accomodations[random.randrange(0, len(accomodations)-1)]
        energy = energy_providers[random.randrange(0, len(energy_providers)-1)]

        # randomise an amount for each bill
        mob_amt = - random.randrange(6, 35) + random.randrange(0, 100, 5) / 100
        counc_amt = - random.randrange(100, 150) + random.randrange(0, 100) / 100
        accom_amt = - random.randrange(300, 1200) + random.randrange(0, 100) / 100
        energy_amt = - random.randrange(20, 80) + random.randrange(0, 100) / 100

        # now loop through each 30 day period
        for i in range(round(days/30)):
            # work out the deltas
            mob_delta = datetime.timedelta(weeks=i*4, days=mob_offset)
            counc_delta = datetime.timedelta(weeks=i*4, days=counc_offset)
            accom_delta = datetime.timedelta(weeks=i*4, days=accom_offset)
            energy_delta = datetime.timedelta(weeks=i*4, days=energy_offset)

            # append the mobile provider
            return_transactions.append(
                Transaction(
                    description=mob['desc'],
                    date=now-mob_delta,
                    amount=mob_amt,
                    account=account,
                    categories=mob['cat']
                )
            )

            # append the council tax
            return_transactions.append(
                Transaction(
                    description=counc['desc'],
                    date=now-counc_delta,
                    amount=counc_amt,
                    account=account,
                    categories=counc['cat']
                )
            )

            # append the accomodation bill
            return_transactions.append(
                Transaction(
                    description=accom['desc'],
                    date=now-accom_delta,
                    amount=accom_amt,
                    account=account,
                    categories=accom['cat']
                )
            )

            # append the energy bill
            return_transactions.append(
                Transaction(
                    description=energy['desc'],
                    date=now-energy_delta,
                    amount=energy_amt,
                    account=account,
                    categories=energy['cat']
                )
            )


    return return_transactions



def acc_transfer(acc_from, acc_to, days, verb='Transfer'):
    now = datetime.datetime.now()
    date = now - datetime.timedelta(days=days)
    return_transactions = []
    amount = random.randrange(100, 500) + random.randrange(0, 100) / 100

    # append the money out
    return_transactions.append(
        Transaction(
            description=f'{verb} to {acc_to.type}',
            date=date,
            amount=-amount,
            account=acc_from,
            categories=[categories['transfer']]
        )
    )

    # append the money in
    return_transactions.append(
        Transaction(
            description=f'{verb} from {acc_from.type}',
            date=date,
            amount=amount,
            account=acc_to,
            categories=[categories['transfer']]
        )
    )

    return return_transactions

import datetime
import random
from models.account import Transaction

small_items = [
    {'desc': 'Tesco supermarket', 'cat': [1, 8]},
    {'desc': 'WM Morrisons', 'cat': [1, 8]},
    {'desc': 'Asda plc', 'cat': [1, 8]},
    {'desc': 'Waitrose supermarket', 'cat': [1, 8]},
    {'desc': 'Pret a Manger', 'cat': [5]},
    {'desc': 'Itsu', 'cat': [5]},
    {'desc': 'Starbucks', 'cat': [5]},
    {'desc': 'Caffe Nero', 'cat': [5]},
    {'desc': 'Transfer to J Smith', 'cat': [3]},
    {'desc': 'Transfer to P Aktar', 'cat': [3]},
    {'desc': 'Transfer to I Johnson', 'cat': [3]}
]

med_items = [
    {'desc': 'Zara Oxford street', 'cat': [1]},
    {'desc': 'Asos Online', 'cat': [1]},
    {'desc': 'Amazon EU SarL', 'cat': [1]},
    {'desc': 'Robert Dyas Ltd', 'cat': [1]},
    {'desc': 'John Lewis', 'cat': [1]},
    {'desc': 'B&Q ltd.', 'cat': [1]},
    {'desc': 'Transfer to S Tidswell', 'cat': [3]},
    {'desc': 'Transfer to A Golding', 'cat': [3]},
    {'desc': 'Transfer to G Folino', 'cat': [3]}
]

large_items = [
    {'desc': 'Thomas Cook', 'cat': [4]},
    {'desc': 'AirBnB', 'cat': [4]},
    {'desc': 'Expedia', 'cat': [4]},
    {'desc': 'Tui Travel', 'cat': [4]},
    {'desc': 'Ryanair', 'cat': [4]},
    {'desc': 'British Airways', 'cat': [4]},
    {'desc': 'Marriot International', 'cat': [4]}
]

mobile_phones = [
    {'desc': 'o2 Mobile Direct Debit', 'cat': [2]},
    {'desc': 'EE UK Ltd', 'cat': [2]},
    {'desc': 'Vodafone', 'cat': [2]}
]

accomodations = [
    {'desc': 'Santander UK Mortgage', 'cat': [2]},
    {'desc': 'Rent Standing Order', 'cat': [2]},
    {'desc': 'Halifax Mortgage', 'cat': [2]}
]

councils = [
    {'desc': 'Westminster Council Tax', 'cat': [2]},
    {'desc': 'Lambeth Council Tax', 'cat': [2]},
    {'desc': 'Tower Hamlets Council Tax', 'cat': [2]},
    {'desc': 'Leeds Council Tax', 'cat': [2]},
    {'desc': 'Bradford Council Tax', 'cat': [2]}
]

energy_providers = [
    {'desc': 'npower Direct Debit', 'cat': [2]},
    {'desc': 'Scottish Power', 'cat': [2]},
    {'desc': 'Bulb Energy', 'cat': [2]},
    {'desc': 'eon Direct Debit', 'cat': [2]},
    {'desc': 'British Gas', 'cat': [2]}
]

med_inc_items = [
    {'desc': 'Transfer from S Atyam', 'cat': [6]},
    {'desc': 'Transfer from S Laygreaves', 'cat': [6]},
    {'desc': 'Transfer from U Ali', 'cat': [6]},
    {'desc': 'Transfer from K McLindon', 'cat': [6]},
    {'desc': 'Refund from Asos Online', 'cat': [6]}
]


# quantity corresponds to small, medium and large purchases in that order in a list
def add_transactions_rnd(account, categories, days, number):

    now = datetime.datetime.now()
    return_transactions = []

    # build the small random transactions
    for i in range(number["small"]):
        # create a timedelta based on a random day in the range between 0 and the inputted days
        delta = datetime.timedelta(days=random.randrange(0, days))
        # choose a random small item
        item = small_items[random.randrange(0, len(small_items)-1)]
        # build the categories
        cats = []
        for cat in item["cat"]:
                cats.append(categories[cat - 1])

        return_transactions.append(
            Transaction(
                description=item['desc'],
                date=now - delta,
                amount=- random.randrange(1, 15) + random.randrange(0, 100) / 100,
                account=account,
                categories=cats
            )
        )


    # build the medium random transactions
    for i in range(number["medium"]):
        # create a timedelta based on a random day in the range between 0 and the inputted days
        delta = datetime.timedelta(days=random.randrange(0, days))
        # choose a random small item
        item = med_items[random.randrange(0, len(med_items)-1)]
        # build the categories
        cats = []
        for cat in item["cat"]:
                cats.append(categories[cat - 1])

        return_transactions.append(
            Transaction(
                description=item['desc'],
                date=now-delta,
                amount=- random.randrange(20, 200) + random.randrange(0, 100) / 100,
                account=account,
                categories=cats
            )
        )

    # build the large random transactions
    for i in range(number["large"]):
        # create a timedelta based on a random day in the range between 0 and the inputted days
        delta = datetime.timedelta(days=random.randrange(0, days))
        # choose a random small item
        item = large_items[random.randrange(0, len(large_items)-1)]
        # build the categories
        cats = []
        for cat in item["cat"]:
                cats.append(categories[cat - 1])

        return_transactions.append(
            Transaction(
                description=item['desc'],
                date=now-delta,
                amount=- random.randrange(100, 400) + random.randrange(0, 100) / 100,
                account=account,
                categories=cats
            )
        )

    return return_transactions


def add_transactions_bills(account, categories, days, bills=False):

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
        counc_amt = - random.randrange(100, 150) + \
            random.randrange(0, 100) / 100
        accom_amt = - random.randrange(300, 1200) + \
            random.randrange(0, 100) / 100
        energy_amt = - random.randrange(20, 80) + \
            random.randrange(0, 100) / 100

        # now loop through each 30 day period
        for i in range(round(days/30)):
            # work out the deltas
            mob_delta = datetime.timedelta(weeks=i*4, days=mob_offset)
            counc_delta = datetime.timedelta(weeks=i*4, days=counc_offset)
            accom_delta = datetime.timedelta(weeks=i*4, days=accom_offset)
            energy_delta = datetime.timedelta(weeks=i*4, days=energy_offset)

            # build the categories
            cats = []
            for cat in mob["cat"]:
                    cats.append(categories[cat - 1])
                    
            # append the mobile provider
            return_transactions.append(
                Transaction(
                    description=mob['desc'],
                    date=now-mob_delta,
                    amount=mob_amt,
                    account=account,
                    categories=cats
                )
            )

            # build the categories
            cats = []
            for cat in counc["cat"]:
                    cats.append(categories[cat - 1])

            # append the council tax
            return_transactions.append(
                Transaction(
                    description=counc['desc'],
                    date=now-counc_delta,
                    amount=counc_amt,
                    account=account,
                    categories=cats
                )
            )

            # build the categories
            cats = []
            for cat in accom["cat"]:
                    cats.append(categories[cat - 1])

            # append the accomodation bill
            return_transactions.append(
                Transaction(
                    description=accom['desc'],
                    date=now-accom_delta,
                    amount=accom_amt,
                    account=account,
                    categories=cats
                )
            )

            # build the categories
            cats = []
            for cat in energy["cat"]:
                    cats.append(categories[cat - 1])

            # append the energy bill
            return_transactions.append(
                Transaction(
                    description=energy['desc'],
                    date=now-energy_delta,
                    amount=energy_amt,
                    account=account,
                    categories=cats
                )
            )

    return return_transactions

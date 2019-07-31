import datetime
import random
from models.account import Transaction

small_items = [
    {'desc': 'Tesco supermarket', 'cat': ['shopping', 'supermarket']},
    {'desc': 'WM Morrisons', 'cat': ['shopping', 'supermarket']},
    {'desc': 'Asda plc', 'cat': ['shopping', 'supermarket']},
    {'desc': 'Waitrose supermarket', 'cat': ['shopping', 'supermarket']},
    {'desc': 'Pret a Manger', 'cat': ['eating_out']},
    {'desc': 'Itsu', 'cat': ['eating_out']},
    {'desc': 'Starbucks', 'cat': ['eating_out']},
    {'desc': 'Caffe Nero', 'cat': ['eating_out']},
    {'desc': 'Transfer to J Smith', 'cat': ['transfer']},
    {'desc': 'Transfer to P Aktar', 'cat': ['transfer']},
    {'desc': 'Transfer to I Johnson', 'cat': ['transfer']}
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
            {
                "description": item['desc'],
                "date": "01/01/2019",
                "amount": - random.randrange(1, 15) + random.randrange(0, 100) / 100,
                "account": account,
                # "categories": item['cat']
            }
        )

    return return_transactions

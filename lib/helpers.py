def is_unique(model, key, value):
    if model.query.filter(getattr(model, key) == value).first():
        print('is not unique')
        return False

    print('Is unique')
    return True

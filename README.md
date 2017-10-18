# validator
very basic validation service

####Usage:

single validation:
```
var isValid = Validator.validate('paul@low-res.de','email')
```

multiple validations as string:
```
var isValid = Validator.validate('paul@low-res.de','required|email')
```

validation can be function as well:
```
var myValidation = _.bind(function(){ return true }, this);
var isValid = Validator.validate('paul@low-res.de', myValidation)
```

you can also pass array of validations
```
var myValidation = _.bind(function(){ return true }, this);
var isValid = Validator.validate('paul@low-res.de', ['email',myValidation])
```

Default validations are
- required`
- email
- numerical

####Custom validations:
```
var customTest =  _.bind( function ( value ) {
    return value == "XYZ";
}, this );
Validator.addValidation('isXYZ', customTest);
var isValid = Validator.validate('XYZ', 'isXYZ');
```

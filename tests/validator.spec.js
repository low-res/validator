define([
    "npm:lodash@4.17.4",
    "../src/validator"
], function ( _, Validator ) {

    describe('Validator', function () {

        beforeEach( function () {

        });

        it('should not validate required fields that are empty', function () {
            var res = Validator.validate('', 'required');
            expect(res).toBeFalsy();

            res = Validator.validate(null, 'required');
            expect(res).toBeFalsy();

            res = Validator.validate(undefined, 'required');
            expect(res).toBeFalsy();

            res = Validator.validate([], 'required');
            expect(res).toBeFalsy();

            var errors = Validator.getLastValidationErrors();
            expect(errors.length).toEqual(1);
            expect(errors[0]).toEqual('validationerror.required');
        });


        it('should validate none empty values as required', function () {
            var res = Validator.validate('xyz', 'required');
            expect(res).toBeTruthy();

            res = Validator.validate([1,2,3], 'required');
            expect(res).toBeTruthy();

            var errors = Validator.getLastValidationErrors();
            expect(errors.length).toEqual(0);
        });


        it('should validate email addresses', function () {
            var res = Validator.validate('paul@low-res.de', 'email');
            expect(res).toBeTruthy();

            res = Validator.validate('paul(at)low-res', 'email');
            expect(res).toBeFalsy();

            var errors = Validator.getLastValidationErrors();
            expect(errors.length).toEqual(1);
            expect(errors[0]).toEqual('validationerror.email');
        });


        it('should validate numeriacal values', function () {
            var res = Validator.validate('123.345,67', 'numerical');
            expect(res).toBeTruthy();

            res = Validator.validate('0xff3345', 'numerical');
            expect(res).toBeFalsy();

            var errors = Validator.getLastValidationErrors();
            expect(errors.length).toEqual(1);
            expect(errors[0]).toEqual('validationerror.numerical');
        });


        it('should validate multiple string validations', function () {
            var res = Validator.validate('e', 'numerical|email');
            expect(res).toBeFalsy();

            var errors = Validator.getLastValidationErrors();
            expect(errors.length).toEqual(2);
            expect(errors[0]).toEqual('validationerror.numerical');
            expect(errors[1]).toEqual('validationerror.email');
        });


        it('should validate with a given function', function () {
            var validation = _.bind(function ( valueToTest ) {
                return _.startsWith( valueToTest, "XYZ");
            }, this);

            var res = Validator.validate('12345', validation);
            expect(res).toBeFalsy();

            var errors = Validator.getLastValidationErrors();
            expect(errors.length).toEqual(1);
            expect(errors[0]).toEqual('validationerror.generic');
        });


        it('should validate with a given array', function () {
            var validation = _.bind(function ( valueToTest ) {
                return _.startsWith( valueToTest, "XYZ");
            }, this);

            var res = Validator.validate('12345', ['numerical', validation] );
            expect(res).toBeFalsy();
            var errors = Validator.getLastValidationErrors();
            expect(errors.length).toEqual(1);
            expect(errors[0]).toEqual('validationerror.generic');
        });

        it('should respect custom errormessages when given as validation', function () {
            var customValidationFunc = _.bind(function ( valueToTest ) {
                return _.startsWith( valueToTest, "XYZ");
            }, this);

            var res = Validator.validate('12345', ['numerical', {validation:customValidationFunc, msg:'my.custom.validation.message'}] );
            expect(res).toBeFalsy();
            var errors = Validator.getLastValidationErrors();
            expect(errors.length).toEqual(1);
            expect(errors[0]).toEqual('my.custom.validation.message');
        })


        it('should be possible to add custom validations', function () {
            var customTest =  _.bind( function ( value ) {
                return value == "XYZ";
            }, this );
            Validator.addValidation('isXYZ', customTest);

            var res = Validator.validate('XYZ', 'isXYZ');
            expect(res).toBeTruthy();

            res = Validator.validate('xyz123', 'isXYZ');
            expect(res).toBeFalsy();

            var errors = Validator.getLastValidationErrors();
            expect(errors.length).toEqual(1);
            expect(errors[0]).toEqual('validationerror.isXYZ');
        });

    });

});
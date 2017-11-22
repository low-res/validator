/**
 * Validator
 *
 */
define([
    "lodash"
], function( _ ) {

    var instance = null;
    var p = Validator.prototype;

    function Validator() {
        this.validationErrors   = [];
        this.customValidations  = [];
    }
    
    p.validate = function ( valueToTest, validation ) {
        var self = this;
        this.validationErrors = [];
        var tests = this._prepareValidations(validation);
        var singleTest;
        var isValid = _.reduce( tests, function ( allValid, tmpValidation) {
            singleTest = self._doSingleValidation(valueToTest, tmpValidation);
            return allValid && singleTest;
        }, true );
        return isValid;
    }

    p.getLastValidationErrors = function () {
        return this.validationErrors;
    }

    p.addValidation = function ( name, validation ) {
        if(!_.find(this.customValidations, ['name', name])) {
            this.customValidations.push( {name:name, validation:validation, msg:'validationerror.'+name} );
        }
    }

    /**
     * test if a certain validation is included in the given
     * validation object
     */
    p.containsValidation = function ( validationToFind, validationObject) {
        var v = this._prepareValidations(validationObject);
        console.log( v );
        var f = _.find(v, {'validation':validationToFind});
        return f ? true : false;
    }


    ///////////////////////////////////////////
    //
    //  IMPLEMENTATION DETAIL
    //
    ///////////////////////////////////////////

    /**
     * take various styles of validation definition and prepare
     * a stansdartized array to work with further.
     *
     * @param validation
     * @return array
     * @private
     */
    p._prepareValidations = function ( validationDefinitions ) {
        var self = this;
        var validationsArray = [];

        if(_.isString(validationDefinitions)) validationDefinitions = validationDefinitions.split("|");

        if(_.isFunction(validationDefinitions)) {
            validationsArray.push({
                validation:validationDefinitions
            });
        }

        if(_.isPlainObject(validationDefinitions) && validationDefinitions.validation) {
            validationsArray.push(validationDefinitions);
        }

        if( _.isArray(validationDefinitions) ) {
            _.forEach( validationDefinitions, function ( tmpVal ) {
                validationsArray.push( self._prepareValidationItem(tmpVal) );
            } )
        }
        return validationsArray;
    }

    p._prepareValidationItem = function ( validation ) {
        var res = {};
        if(_.isString(validation) ) {
            var customValidation = _.find(this.customValidations, ['name', validation]);
            if( customValidation ) res = customValidation
            else res.validation = validation;
        }

        if( _.isFunction(validation) ) {
            res.validation = validation;
        }

        if(_.isPlainObject(validation)) {
            if(validation.validation) res = validation;
            else throw(new Error("a given validation object must at leatst have a property 'validation'!"));
        }
        return res;
    }

    p._doSingleValidation = function( valueToTest, validationObject ) {
        var res         = true;
        var error_msg   = validationObject.msg || null;
        var validation  = validationObject.validation;

        if(_.isString(validation)) {
            switch( validation ) {
                case "required":
                    res = !_.isEmpty(valueToTest) || _.isDate(valueToTest) || _.isNumber(valueToTest);
                    break;

                case "email":
                    if( !_.isEmpty(valueToTest) ) {
                        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        res = re.test(valueToTest);
                    }
                    break;

                case "numerical":
                    var re = /^[0-9,\.]*$/;
                    res = re.test(valueToTest);
                    break;

                default:
                    res = true;
            }
            if(!res ) this.validationErrors.push( error_msg || "validationerror."+validation );
        }

        if(_.isFunction(validation)) {
            res = validation( valueToTest );
            if(!res) this.validationErrors.push(error_msg || "validationerror.generic");
        }

        console.log( "_doSingleValidation", valueToTest, validationObject, res );
        return res;
    }

    Validator.getInstance = function(){
        if( instance == null ) instance = new Validator();
        return instance;
    }

    return Validator.getInstance();

});
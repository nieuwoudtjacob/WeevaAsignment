
import { AbstractControl, FormArray, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';



export function emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        const value = control.value;

        if (!value) {
            return null;
        }

        const hasRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/.test(value);

        const emailValid = hasRegex;

        return !emailValid ? { emailValid: true } : null;
    }



}


export function passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        const value = control.value;

        if (!value) {
            return null;
        }

        const hasRegex = /^.{4,}$/.test(value);

        const passwordValid = hasRegex;

        return !passwordValid ? { passwordValid: true } : null;
    }

}

export function phoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        const value = control.value;

        if (!value) {
            return null;
        }

        const hasRegex = /27[0-9]{9}$/.test(value);

        const phoneValid = hasRegex;

        return !phoneValid ? { phoneValid: true } : null;
    }

}
export function identityValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        const value = control.value;

        if (!value) {
            return null;
        }

        const hasRegex = /^(((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(\d{4})( |-)(\d{3})|(\d{7}))$/.test(value);

        const indentityValid = hasRegex;

        return !indentityValid ? { indentityValid: true } : null;
    }

}

export function websiteValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        const value = control.value;

        if (!value) {
            return null;
        }

        const hasRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/.test(value);

        const websiteValid = hasRegex;

        return !websiteValid ? { websiteValid: true } : null;
    }

}




export function notNullValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        const value = control.value;
        if (!value) {
            return null;
        }
        const hasRegex = /(.|\s)\S/.test(value);
        var notNullValid = hasRegex;
        const emptyRegexTest = /^\s*$/.test(value);


        if (emptyRegexTest == true) {
            return null;
        }

        if (value == '') {
            notNullValid = false;
        }
        if (value == "") {
            notNullValid = false;
        }
        if (value == null) {
            notNullValid = false;
        }
        if (value == undefined) {
            notNullValid = false;
        }


        return !notNullValid ? { notNullValid: true } : null;
    }

}



export function notNullValidatorNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        const value = control.value;


        const hasRegex = /(.|\s)\S/.test(value);
        var notNullValid = hasRegex;
        const emptyRegexTest = /^\s*$/.test(value);

        if (value == '') {
            notNullValid = false;
        }
        if (value == "") {
            notNullValid = false;
        }
        if (value == null) {
            notNullValid = false;
        }
        if (value == undefined) {
            notNullValid = false;
        }

        if (value == Infinity) {
            notNullValid = false;
        }

        if (value <= 0) {
            notNullValid = false;
        }

        if (emptyRegexTest == true) {
            notNullValid = true;
        }

        return !notNullValid ? { notNullValid: true } : null;
    }

}











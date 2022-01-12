import { Component } from '@angular/core';
import { AbstractControl, Form, FormGroup } from '@angular/forms';

@Component({
  template: ''
})
export class BaseFormEditComponent {

  public title: string;

  public form: FormGroup;

  public getControl(controlName: string): AbstractControl | null {
    return this.form.get(controlName);
  }

  public formFieldIsModified(fieldName: string): boolean {
    let field = this.getControl(fieldName);
    if (field?.dirty || field?.touched) {
      return true;
    }
    return false;
  }

  public formFieldIsInvalid(fieldName: string): boolean {
    let field = this.getControl(fieldName);
    if (field?.invalid) {
      return true;
    }
    return false;
  }

  public formFieldHasError(fieldName: string): boolean {
    if (this.formFieldIsInvalid(fieldName) && this.formFieldIsModified(fieldName)) {
      return true;
    }
    return false;
  }

  public formFieldHasRequiredError(fieldName: string): string | null {
    let field = this.getControl(fieldName);
    if (field?.errors?.required) {
      return this.getFieldLabel(fieldName) + " is required";
    }
    return null;
  }

  public formFieldDoesNotMatchPattern(fieldName: string, patternDescription?: string): string | null {
    let field = this.getControl(fieldName);
    if (field?.errors?.pattern) {
      return this.getFieldLabel(fieldName) + " does not match required pattern" + (patternDescription ? ": " + patternDescription : "");
    }
    return null;
  }

  public formFieldOutOfRange(fieldName: string, rangeMin: number, rangeMax: number): string | null {
    let field = this.getControl(fieldName);
    if (field?.errors?.min || field?.errors?.max) {
      return this.getFieldLabel(fieldName) + " must be in range " + rangeMin + " to " + rangeMax;
    }
    return null;
  }

  public getFieldLabel(fieldName: string): string {
    let label = document.getElementById(fieldName + "Label")?.innerHTML;
    if (label) {
      label = label.endsWith(":")
        ? label?.substring(0, label.length - 1)
        : label;
        return label;
    }
    return fieldName;
  }
}

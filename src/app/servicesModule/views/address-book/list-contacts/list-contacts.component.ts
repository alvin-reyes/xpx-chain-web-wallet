import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit, HostListener } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from "@angular/forms";
import { ModalDirective, MdbTablePaginationComponent, MdbTableDirective } from 'ng-uikit-pro-standard';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ServicesModuleService } from "../../../services/services-module.service";
import { AppConfig } from '../../../../config/app.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-contacts',
  templateUrl: './list-contacts.component.html',
  styleUrls: ['./list-contacts.component.css']
})
export class ListContactsComponent {

  moduleName = 'Address Book';
  componentName = 'LIST';
  goBack = `/${AppConfig.routes.service}`;
  addContacts = `/${AppConfig.routes.addContacts}`;
  //Pagination
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  @HostListener('input') oninput() {
    this.searchItems();
  }

  previous: any = [];

  headElements = ['Label', 'Account address', 'Actions'];
  contactForm: FormGroup;
  contacts = [];
  searchContact = '';
  searching = false;
  hideTable = false;


  constructor(
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private serviceModuleService: ServicesModuleService,
    private sharedService: SharedService,
    private router: Router
  ) {
    this.hideTable = false;
  }

  ngOnInit() {
    this.hideTable = false;
    const contacts = this.serviceModuleService.getBooksAddress();
    this.contacts = (contacts !== null && contacts !== undefined) ? contacts : [];
    this.mdbTable.setDataSource(this.contacts);
    this.contacts = this.mdbTable.getDataSource();
    this.previous = this.mdbTable.getDataSource();
    this.createFormContact();
  }

  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(5);
    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

  createFormContact() {
    this.contactForm = this.fb.group({
      user: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      address: ['', [Validators.required, Validators.minLength(40), Validators.maxLength(46)]]
    });
  }

  /**
  * clearForm form
  *
  * @param {(string | (string | number)[])} [custom]
  * @param {(string | number)} [formControl]
  * @returns
  * @memberof TransferComponent
  */
  clearForm(
    custom?: string | (string | number)[],
    formControl?: string | number
  ) {
    if (custom !== undefined) {
      if (formControl !== undefined) {
        this.contactForm.controls[formControl].get(custom).reset();
        return;
      }
      this.contactForm.get(custom).reset();
      return;
    }
    this.contactForm.reset();
    return;
  }

  /**
   * Get Error
   *
   * @param {*} control
   * @param {*} [typeForm]
   * @param {*} [formControl]
   * @returns
   * @memberof AddressBookComponent
   */
  getError(control, typeForm?, formControl?) {
    const form = this.contactForm;
    if (formControl === undefined) {
      if (form.get(control).getError('required')) {
        return `This field is required`;
      } else if (form.get(control).getError('minlength')) {
        return `This field must contain minimum ${form.get(control).getError('minlength').requiredLength} characters`;
      } else if (form.get(control).getError('maxlength')) {
        return `This field must contain maximum ${form.get(control).getError('maxlength').requiredLength} characters`;
      }
    } else {
      if (form.controls[formControl].get(control).getError('required')) {
        return `This field is required`;
      } else if (form.controls[formControl].get(control).getError('minlength')) {
        return `This field must contain minimum ${form.controls[formControl].get(control).getError('minlength').requiredLength} characters`;
      } else if (form.controls[formControl].get(control).getError('maxlength')) {
        return `This field must contain maximum ${form.controls[formControl].get(control).getError('maxlength').requiredLength} characters`;
      } else if (form.controls[formControl].getError('noMatch')) {
        return `Password doesn't match`;
      }
    }
  }

  /**
   *
   *
   * @param {string} [nameInput='']
   * @param {string} [nameControl='']
   * @param {string} [nameValidation='']
   * @returns
   * @memberof CreateNamespaceComponent
   */
  validateInput(nameInput: string = '', nameControl: string = '', nameValidation: string = '') {
    let validation: AbstractControl = null;
    if (nameInput !== '' && nameControl !== '') {
      validation = this.contactForm.controls[nameControl].get(nameInput);
    } else if (nameInput === '' && nameControl !== '' && nameValidation !== '') {
      validation = this.contactForm.controls[nameControl].getError(nameValidation);
    } else if (nameInput !== '') {
      validation = this.contactForm.get(nameInput);
    }
    return validation;
  }

  navigate(name) {
    this.router.navigate([`${AppConfig.routes.addContacts}/${name}`]);
  }

  /**
   * Save contact
   *
   * @returns
   * @memberof AddressBookComponent
   */
  saveContact() {
    if (this.contactForm.valid) {
      const dataStorage = this.serviceModuleService.getBooksAddress();
      const books = { value: this.contactForm.get('address').value, label: this.contactForm.get('user').value };
      if (dataStorage === null) {
        this.serviceModuleService.setBookAddress([books]);
        this.contactForm.reset();
        this.sharedService.showSuccess('', `Successfully created user`);
        this.contacts = this.serviceModuleService.getBooksAddress();
        this.mdbTable.setDataSource(this.contacts);
        this.contacts = this.mdbTable.getDataSource();
        this.previous = this.mdbTable.getDataSource();
        return;
      }

      const issetData = dataStorage.find(element => element.label === this.contactForm.get('user').value);
      if (issetData === undefined) {
        dataStorage.push(books);
        this.serviceModuleService.setBookAddress(dataStorage);
        this.contactForm.reset();
        this.sharedService.showSuccess('', `Successfully created contact`);
        this.contacts = this.serviceModuleService.getBooksAddress();
        this.mdbTable.setDataSource(this.contacts);
        this.contacts = this.mdbTable.getDataSource();
        this.previous = this.mdbTable.getDataSource();
        return;
      }

      this.sharedService.showError('User repeated', `The contact "${this.contactForm.get('user').value}" already exists`);
    }
  }


  /**
   * Filter contacts
   *
   * @memberof AddressBookComponent
   */
  searchItems() {
    const prev = this.mdbTable.getDataSource();
    if (!this.searchContact) {
      this.mdbTable.setDataSource(this.previous);
      this.contacts = this.mdbTable.getDataSource();
    }

    if (this.searchContact) {
      this.contacts = this.mdbTable.searchLocalDataBy(this.searchContact);
      this.mdbTable.setDataSource(prev);
    }
  }

  /**
   * Remove contacts
   *
   * @param {string} label
   * @memberof AddressBookComponent
   */
  remove(label: string) {
    const newContacts = [];
    this.contacts.forEach(element => {
      if (element.label !== label) {
        newContacts.push(element);
      }
    });
    this.serviceModuleService.setBookAddress(newContacts);
    this.contacts = newContacts;
    this.mdbTable.setDataSource(this.contacts);
    this.contacts = this.mdbTable.getDataSource();
    this.previous = this.mdbTable.getDataSource();
  }

}

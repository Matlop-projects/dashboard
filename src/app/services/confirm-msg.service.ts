import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ConfirmMsgService {
  constructor(private confirmationService: ConfirmationService, private messageService: MessageService) {}


   formHasValue(form:any){
    const formValues = form.value;
    return Object.values(formValues).some(value => !!value);
   }
   
 

   confirm(event: Event) {
       this.confirmationService.confirm({
           target: event.target as EventTarget,
           message: 'Are you sure that you want to proceed?',
           header: 'Confirmation',
           closable: true,
           closeOnEscape: true,
           icon: 'pi pi-exclamation-triangle',
           rejectButtonProps: {
               label: 'Cancel',
               severity: 'secondary',
               outlined: true,
           },
           acceptButtonProps: {
               label: 'Save',
           },
           accept: () => {
               this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
           },
           reject: () => {
               this.messageService.add({
                   severity: 'error',
                   summary: 'Rejected',
                   detail: 'You have rejected',
                   life: 3000,
               });
           },
       });
   }
 
   close(event: Event) {
       this.confirmationService.confirm({
           target: event.target as EventTarget,
           message: 'Do you want to delete this record?',
           header: 'Danger Zone',
           icon: 'pi pi-info-circle',
           rejectLabel: 'Cancel',
           rejectButtonProps: {
               label: 'Cancel',
               severity: 'secondary',
               outlined: true,
           },
           acceptButtonProps: {
               label: 'Delete',
               severity: 'danger',
           },
 
           accept: () => {
               this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
           },
           reject: () => {
               this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
           },
       });
   }
 }


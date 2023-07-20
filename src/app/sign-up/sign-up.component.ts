import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,  Validators } from '@angular/forms';
import { passwordMatchingValidatior } from '../passwordMatchingValidatior';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  type:string="password"
  isText:boolean=false;
  eyeIcon:string="fa-eye-slash"

  //signUpForm!:FormGroup;
  signUpForm: FormGroup = new FormGroup({}); //add

    constructor(private fb: FormBuilder,private http: HttpClient,private router: Router){
    }
    ngOnInit(): void {
      this.signUpForm=this.fb.group({
        emailId:['',[Validators.required,Validators.email,Validators.pattern('[a-z0-9]+@gmail.com')]],
         password:['',[Validators.required,Validators.minLength(8)]],
         confirmPassword: ['',[Validators.required,Validators.minLength(8)]],
        phone:['',[Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]]
      },{validators:passwordMatchingValidatior})
    
    }
    
    
    hideShowPass(){
        this.isText=!this.isText
        this.isText?this.eyeIcon="fa-eye" : this.eyeIcon="fa-eye-slash"
        this.isText?this.type="text" :this.type="password"
        this.isText?this.type="text" :this.type="confirmPassword"
    }
    onSubmit(){
      if(this.signUpForm.valid){
         console.log(this.signUpForm.value)
      }else{
         //throw the error using toaster and with required fields
         this.validateAllFormFileds(this.signUpForm);
         alert("invalid Registration!!")
      }
    }
    
    //click submit button error
    private validateAllFormFileds(formGroup:FormGroup){
      Object.keys(formGroup.controls).forEach(field=>{
        const control=formGroup.get(field)
        if(control instanceof FormControl){
          control.markAsDirty({onlySelf:true})
        }else if(control instanceof  FormGroup){
          this.validateAllFormFileds(control)
        }
      })
    }

    signUp() {
      this.http.post<any>("http://localhost:3000/signupUsers", this.signUpForm.value)
        .subscribe(
          (res) => {
            alert("Signup Successful");
            this.signUpForm.reset();
            this.router.navigate(['login']);
          },
          (err) => {
            alert("Signup Failed. Please try again.");
          }
        );
    }
  }

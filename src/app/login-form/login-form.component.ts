import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,  Validators } from '@angular/forms';
import{HttpClient} from '@angular/common/http';
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  type:string="password"
  isText:boolean=false;
  eyeIcon:string="fa-eye-slash"

  loginForm!:FormGroup;
    constructor(private fb: FormBuilder,private http: HttpClient,){}
    ngOnInit(): void {
      this.loginForm=this.fb.group({
        emailId:['',Validators.required],
        password:['',Validators.required]
      })
    }

    hideShowPass(){
        this.isText=!this.isText
        this.isText?this.eyeIcon="fa-eye" : this.eyeIcon="fa-eye-slash"
        this.isText?this.type="text" :this.type="password"
    }
    onSubmit(){
      if(this.loginForm.valid){
         console.log(this.loginForm.value)
      }else{
        // console.log("invalid lodin")
         //throw the error using toaster and with required fields
         this.validateAllFormFileds(this.loginForm);
         alert("invalid login!!")
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

    login(){
      this.http.get<any>("http://localhost:3000/signupUsers").subscribe(
        res=>{
          const user = res.find((a: any) => {
            return a.emailId === this.loginForm.value.emailId && a.password === this.loginForm.value.password;
          });
          if (user) {
            alert("Login Success!!")
            this.loginForm.reset();
            // this.router.navigate(['/dashboard']);
          } else {
            alert("User not found");
          }
        }, err => {
          alert("Something went wrong");
        }
      )
    }
}

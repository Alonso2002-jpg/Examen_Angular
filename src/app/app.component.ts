import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MyValidatios} from "../validations/my-validators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  validado = false;
  pedidos: Pedido[]=[];
  envio: Envio = new Envio();
  fechaActual= (new Date().getMonth()+1) + "-" + new Date().getDate() + "-" + new Date().getFullYear();
  formEnvios = new FormGroup({
    fecha:new FormControl(this.fechaActual,[Validators.required, MyValidatios.validarFecha]),
    empresa:new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
    email:new FormControl('', [Validators.required, Validators.email]),
    instagram:new FormControl('@some-example', [Validators.required, MyValidatios.validarIg, Validators.minLength(3)]),
    cliente:new FormControl('', []),
    origen:new FormControl({value:'', disabled:true}, [MyValidatios.validarOrigen]),
    proviene:new FormControl('', [Validators.required]),
    pais:new FormControl({value:'', disabled:true}, [MyValidatios.validarPais, Validators.minLength(2), Validators.maxLength(50)]),
  })
  formOrder = new FormGroup({
    peso:new FormControl('00,00', [Validators.required, MyValidatios.validarPeso]),
    tipoEnvio:new FormControl('', [Validators.required, MyValidatios.validarTipoEnvio]),
    paisEnvio:new FormControl('', [Validators.required]),
    precio:new FormControl({value:0, disabled:true}, []),
    numEnvios:new FormControl({value:0, disabled:true}, []),
    totalPeso:new FormControl({value:0, disabled:true}, []),
    totalImpES:new FormControl({value:0, disabled:true}, []),
    totalImpEU:new FormControl({value:0, disabled:true}, []),
    totalImpAM:new FormControl({value:0, disabled:true}, []),
    totalImp:new FormControl({value:0, disabled:true}, []),
  })

  setPecio(){
    let pesoReal = parseFloat(<string>this.formOrder.get('peso')?.value?.replace(',', '.'));
    if (this.formOrder.get('paisEnvio')?.value == 'España'){
      if (pesoReal > 0 && pesoReal <= 1) {
        this.formOrder.get('precio')?.setValue(pesoReal * 6);
      } else if (pesoReal > 1 && pesoReal <= 2) {
        this.formOrder.get('precio')?.setValue(pesoReal * 8);
      } else {
        this.formOrder.get('precio')?.setValue(pesoReal * 10);
      }
    }else if (this.formOrder.get('paisEnvio')?.value == "Europa") {
      if (pesoReal > 0 && pesoReal <= 1) {
        this.formOrder.get('precio')?.setValue(pesoReal * 9);
      } else if (pesoReal > 1 && pesoReal <= 2) {
        this.formOrder.get('precio')?.setValue(pesoReal * 12);
      } else {
        this.formOrder.get('precio')?.setValue(pesoReal * 16);
      }
    } else if (this.formOrder.get('paisEnvio')?.value == "America") {
      if (pesoReal > 0 && pesoReal <= 1) {
        this.formOrder.get('precio')?.setValue(pesoReal * 12);
      } else if (pesoReal > 1 && pesoReal <= 2) {
        this.formOrder.get('precio')?.setValue(pesoReal * 16);
      } else {
        this.formOrder.get('precio')?.setValue(pesoReal * 20);
      }
    }
  }

  habilitarOrigen(){
    if (this.formEnvios.get('origen')?.disabled) {
      this.formEnvios.get('origen')?.enable();
    }else{
      this.formEnvios.get('origen')?.disable();
    }
  }

  habilitarPais(){
    if(this.formEnvios.get('proviene')?.value == 'Extranjero'){
      this.formEnvios.get('pais')?.enable();
    }else{
      this.formEnvios.get('pais')?.disable();
    }
  }
  anadirEnvio(){
    if (this.formOrder.valid){
      let imporActualEs = this.formOrder.get('totalImpES')?.value!
      let imporActualEU = this.formOrder.get('totalImpEU')?.value!
      let imporActualAM = this.formOrder.get('totalImpAM')?.value!
      let totalActualImp = this.formOrder.get('totalImp')?.value!
      let destino: string
      let peso: number
      let precio = this.formOrder.get('precio')?.value!;
      let tipoEnvio = this.formOrder.get('tipoEnvio')?.value
      if (this.formOrder.get('paisEnvio')?.value == 'España'){
        destino=this.formOrder.get('paisEnvio')?.value!
        this.formOrder.get('totalImpES')?.setValue(imporActualEs + precio)
      }else if(this.formOrder.get('paisEnvio')?.value == 'Europa'){
        destino=this.formOrder.get('paisEnvio')?.value!
        this.formOrder.get('totalImpEU')?.setValue(imporActualEU + precio)
      }else {
        destino=this.formOrder.get('paisEnvio')?.value!
        this.formOrder.get('totalImpAM')?.setValue(imporActualAM +precio)
      }
      peso = parseFloat(this.formOrder.get('peso')?.value?.replace(',', '.')!);
      console.log(this.formEnvios.get('numEnvios')?.value!);
      console.log(peso)
      this.formOrder.get('totalImp')?.setValue(totalActualImp +precio)
      this.formOrder.get('numEnvios')?.setValue(this.formEnvios.get('numEnvios')?.value! + 1)
      this.formOrder.get('totalPeso')?.setValue(this.formEnvios.get('totalPeso')?.value! + peso)

      let pedido = new Pedido()
      pedido.destino = destino
      pedido.peso = peso
      pedido.precio = precio
      pedido.tipoEnvio = tipoEnvio!

      this.pedidos.push(pedido)
    }else{
      alert('Pedido: Debe rellenar todos los campos')
    }

  }

  eliminarEnvio(id: number){
    let pedActual =this.pedidos.splice(id,1)[0]
    this.formOrder.get('numEnvios')?.setValue(this.formOrder.get('numEnvios')?.value! - 1)
    this.formOrder.get('totalPeso')?.setValue(this.formOrder.get('totalPeso')?.value! - pedActual?.peso!)
    this.formOrder.get('totalImp')?.setValue(this.formOrder.get('totalImp')?.value! - pedActual?.precio!)
    if (pedActual.destino == 'España'){
      this.formOrder.get('totalImpES')?.setValue(this.formOrder.get('totalImpES')?.value! - pedActual?.precio!)
    }else if(pedActual.destino == 'Europa'){
      this.formOrder.get('totalImpEU')?.setValue(this.formOrder.get('totalImpEU')?.value! - pedActual?.precio!)
    }else {
      this.formOrder.get('totalImpAM')?.setValue(this.formOrder.get('totalImpAM')?.value! - pedActual?.precio!)
    }
  }

  hacerPedido(){
    if(this.formOrder.valid){
      let pedido = new Envio()
      pedido.numEnvios = this.formOrder.get('numEnvios')?.value!
      pedido.totalPeso = this.formOrder.get('totalPeso')?.value!
      pedido.totalImpES = this.formOrder.get('totalImpES')?.value!
      pedido.totalImpEU = this.formOrder.get('totalImpEU')?.value!
      pedido.totalImpAM = this.formOrder.get('totalImpAM')?.value!
      pedido.totalImp = this.formOrder.get('totalImp')?.value!
      pedido.pedidos = this.pedidos
      this.envio = pedido
      this.validado = true
    }else{
      alert('Envio: Debe rellenar todos los campos')
    }
  }
}

class Pedido{
  destino?:string = ""
  peso:number = 0
  tipoEnvio?:string = ""
  precio:number = 0
}

class Envio{
  fecha?: Date = new Date()
  empresa?: string = ""
  email?: string = ""
  numEnvios?: number = 0
  totalPeso?: number = 0
  totalImpES?: number = 0
  totalImpEU?: number = 0
  totalImpAM?: number = 0
  totalImp?: number = 0
  pedidos?: Array<Pedido> = new Array<Pedido>()
}

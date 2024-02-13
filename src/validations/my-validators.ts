import {AbstractControl} from "@angular/forms";

export class MyValidatios{

  static validarFecha(control: AbstractControl){
    let fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);
      let fechaRecibida = new Date(control.value);
      if(isNaN(fechaRecibida.getTime())){
        return{ fecha:true };
      }
      if (fechaActual > fechaRecibida) {
        return{ fecha:true };
      }
      return null;
  };

  static validarIg(control: AbstractControl){
    if (control.value.startsWith("@")) {
      return null;
    }
    return { ig:true };
  };

  static validarOrigen(control: AbstractControl){
    if (control.parent?.get('cliente')?.value == true){
      if (control.value == 0) {
        return { origen:true };
      }
    }
    return null;
  }

  static validarPais(control: AbstractControl){
    if (control.parent?.get('proviene')?.value == 'Extranjero'){
      if (control.value == ''){
        return { pais:true };
      }
    }
    return null;
  }

  static validarPeso(control: AbstractControl){
    let pesoRegex =/^\d{1,2},\d{2}$/;
    let valor = parseFloat(control.value.replace(',', '.'));
    if (control.value.match(pesoRegex)) {
      if (valor < 0) {
        return { peso:true };
      }else if(valor > 3){
        return { peso:true };
      }else{
        return null;
      }
    }
    return { peso:true };
  }

  static validarTipoEnvio(control: AbstractControl){
    if(control.value == '-'){
      return { tipoEnvio:true };
    }
    return null
  }
}

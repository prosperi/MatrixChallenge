var system = document.getElementsByName("system")[0];
var answer = document.getElementsByTagName("code")[1];

function calculate(){

  var variables = {},
      exp,
      equations = system.value.replace(/ /g, '').split('\n');
  answer.textContent = "Answer: ";

  for(var i = 0; i < system.value.length; i++){
    if(/[a-z]/.test(system.value.charAt(i)) && !(system.value.charAt(i) in variables)){
      variables[system.value.charAt(i)] = [];
    }
  }

  exp = new RegExp("^((\\d*[a-z][\\+-])+\\d*[a-z]\\=\\d+,?){" + Object.keys(variables).length + "}");

  if(exp.test(equations)){
    console.log(variables, exp.exec(equations)[0]);
    for(var i = 0; i < equations.length; i++){
      for(var vrb in variables){
        var vrbExp = new RegExp("(\\d*)" + vrb);

        if(vrbExp.test(equations[i])){
          var result = vrbExp.exec(equations[i])[1];
          (result) ? variables[vrb].push(Number(result)) : variables[vrb].push(1);
        }else{
          variables[vrb].push(0);
        }

      }
    }
    console.log(variables);
  }else{
    answer.textContent += "boom";
  }

}

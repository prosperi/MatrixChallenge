var system = document.getElementsByName("system")[0];
var answer = document.getElementsByTagName("code")[1];

function init(){

  var variables = {},
      matrix = [],
      equalities = [],
      exp,
      equations = system.value.replace(/ /g, '').split('\n');

  answer.textContent = "Answer: ";

  for(var i = 0; i < system.value.length; i++){
    if(/[a-z]/.test(system.value.charAt(i)) && !(system.value.charAt(i) in variables)){
      variables[system.value.charAt(i)] = [];
    }
  }

  exp = new RegExp("^((\\d*[a-z][\\+-])+\\d*[a-z]\\=(\\d+),?){" + Object.keys(variables).length + "}");

  if(exp.test(equations)){
    for(var i = 0; i < equations.length; i++){
      matrix.push([]);
      equalities.push(Number(/\d+$/.exec(equations[i])[0]));
      for(var vrb in variables){
        var vrbExp = new RegExp("(\\d*)" + vrb);

        if(vrbExp.test(equations[i])){
          var result = vrbExp.exec(equations[i])[1];
          (result) ? variables[vrb].push(Number(result)) : variables[vrb].push(1);
        }else{
          variables[vrb].push(0);
        }

        matrix[i].push(Number(variables[vrb].slice(-1)));

      }
    }

    answer.textContent += calculate(matrix, equalities);
  }else{
    answer.textContent += "Wrong Input";
  }


}


function calculate(matrix, equalities){

  var determinant,
      answer = [],
      inverse = [];

  // Find Determinant Of 2X2 Matrix
  determinant = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];

  // Find the inverse matrix by multiplying given matrix by 1/determinant
  inverse.push([ matrix[1][1]/determinant, -matrix[0][1]/determinant ]);
  inverse.push([ -matrix[1][0]/determinant, matrix[0][0]/determinant ]);

  // Find solution of system by multiplying inverse matrix on equalities matrix(numbers without variable),
  // This contains plain math - 2X2 matrix multiplication on 2X1 one
  // Result will be a matrix of solutions for the system
  answer.push(inverse[0][0] * equalities[0] + inverse[0][1] * equalities[1]);
  answer.push(inverse[1][0] * equalities[0] + inverse[1][1] * equalities[1]);

  // Round answers to nearest hundredth
  answer[0] = Math.round(answer[0]*100)/100;
  answer[1] = Math.round(answer[1]*100)/100;


  return answer;
}

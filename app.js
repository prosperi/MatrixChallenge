var SYSTEM = document.getElementsByName("system")[0];
var ANSWER = document.getElementsByTagName("code")[1];

// Calculate
function calculate(){
  var args = init();

  if(args != null){

    if(args.matrix.length == 2){
      // Solve problem for two equation system, 2X2 Matrix
      calculateEasy(args.matrix, args.equalities).forEach(function(value, index){
        ANSWER.textContent += Object.keys(args.variables)[index] + ":" + value + " | ";
      });
    }else{
      // Solve for 3X3 Matrix
      calculateDifficult(args.matrix, args.equalities).forEach(function(value, index){
        ANSWER.textContent += Object.keys(args.variables)[index] + ":" + value + " | ";
      });
    }


  }else{
    ANSWER.textContent += "Wrong Input";
  }

}

// Initialize
function init(){

  var variables = {},
      matrix = [],
      equalities = [],
      exp,
      equations = SYSTEM.value.replace(/ /g, '').split('\n');

  ANSWER.textContent = "Answer: ";

  // Find which variables are used
  for(var i = 0; i < SYSTEM.value.length; i++){
    if(/[a-z]/.test(SYSTEM.value.charAt(i)) && !(SYSTEM.value.charAt(i) in variables)){
      variables[SYSTEM.value.charAt(i)] = [];
    }
  }


  // Validate input
  exp = new RegExp("^((\\d*[a-z][\\+-])*\\d*[a-z]\\=(\\d+),?){" + Object.keys(variables).length + "}");

  if(exp.test(equations)){
    // Create matrix according to the input
    for(var i = 0; i < equations.length; i++){
      matrix.push([]);
      equalities.push(Number(/\d+$/.exec(equations[i])[0]));
      for(var vrb in variables){
        var vrbExp = new RegExp("(\\d*)" + vrb);
        // Define variable coeficient
        if(vrbExp.test(equations[i])){
          var result = vrbExp.exec(equations[i])[1];
          (result) ? variables[vrb].push(Number(result)) : variables[vrb].push(1);
        }else{
          variables[vrb].push(0);
        }

        matrix[i].push(Number(variables[vrb].slice(-1)));

      }
    }

    console.log(matrix, equalities, variables);

    return {
      matrix: matrix,
      equalities: equalities,
      variables: variables
    };

  }else{
    return null;
  }


}

// Solve for 2X2 matrix
function calculateEasy(matrix, equalities){

  var determinant,
      answer = [],
      inverse = [];

  // Find Determinant Of 2X2 Matrix
  determinant = determinantForTwo(matrix);

  // Find the inverse matrix by multiplying given matrix by 1/determinant
  inverse.push([ matrix[1][1]/determinant, -matrix[0][1]/determinant ]);
  inverse.push([ -matrix[1][0]/determinant, matrix[0][0]/determinant ]);

  // Find solution of system by multiplying inverse matrix on equalities' matrix(numbers without variable),
  // This contains plain math - 2X2 matrix multiplication on 2X1 one
  // Result will be a matrix of solutions for the system
  answer.push(inverse[0][0] * equalities[0] + inverse[0][1] * equalities[1]);
  answer.push(inverse[1][0] * equalities[0] + inverse[1][1] * equalities[1]);

  // Round answers to nearest hundredth
  answer[0] = Math.round(answer[0]*100)/100;
  answer[1] = Math.round(answer[1]*100)/100;


  return answer;
}

//Solve for 3X3 and upper matrix
function calculateDifficult(matrix, equalities){
  var determinant,
      answer = [],
      inverse = [];

  determinant = determinantForThree(matrix);
  inverse = findAdjugate(matrix);


  inverse = inverse.map(function(row){
    row = row.map(function(col){
      return col / determinant;
    });
    return row;
  });

  answer = multiply(inverse, equalities);

  return answer;
}

// 2X2 Determinant
function determinantForTwo(matrix){
  // Simply find 2X2 matrix determinant
  return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
}

// 3X3 Determinant
function determinantForThree(matrix){
  // Simply find 3X3 matrix determinant
  return matrix[0][0] * determinantForTwo([ [matrix[1][1], matrix[1][2]], [matrix[2][1], matrix[2][2]] ]) -
         matrix[0][1] * determinantForTwo([ [matrix[1][0], matrix[1][2]], [matrix[2][0], matrix[2][2]] ]) +
         matrix[0][2] * determinantForTwo([ [matrix[1][0], matrix[1][1]], [matrix[2][0], matrix[2][1]] ]);
}

// 3X3 matrix cofactor
function findCofactor(matrix){
  var cofactor = [];
  for(var i = 0; i < matrix.length; i++){
    cofactor.push([]);
    for(var j = 0; j < matrix.length; j++){

      var value = [];
      for(var row = 0; row < matrix.length; row++){
        for(var col = 0; col < matrix.length; col++){
          if(row != i && col !== j) value.push(matrix[row][col]);
        }
      }

      value = [[value[0], value[1]], [value[2], value[3]]];
      cofactor[i].push(determinantForTwo(value));

    }
  }
  return cofactor;
}

// 3X3 matrix adjugate matrix finder
function findAdjugate(matrix){
  var adjugate = [],
      cofactor = findCofactor(matrix),
      power = 0;

  for(var row = 0; row < cofactor.length; row++){
    adjugate.push([0,0,0]);
  }

  for(var i = 0; i < cofactor.length; i++){
    for(var j = 0; j < cofactor.length; j++){
      var m = cofactor[i][j] * Math.pow(-1, power);
      adjugate[j][i] = m;
      power++;
    }
  }

  return adjugate;

}

// Matrix multiplication --> multiply inverse matrix on equalities --> answer
function multiply(matrix, equalities){
  var answer = [];
  matrix.forEach(function(value){

    var sum = 0;
    value.forEach(function(value, index){
      sum += value * equalities[index];
    });
    answer.push(sum);

  });

  return answer;
}

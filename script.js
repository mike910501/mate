let relation = ""; // Variable global para almacenar la relación

function addToRelation(value) {
    if (relation.length > 0 && (['+', '-', '*', '/'].includes(value) || value === '=')) {
        const lastChar = relation.slice(-1);
        if (['+', '-', '*', '/'].includes(lastChar) && ['+', '-', '*', '/'].includes(value)) {
            return; // Evitar operadores consecutivos
        }
        if (value === '=' && lastChar === '=') {
            return; // Evitar '==' consecutivos
        }
    }
    
    relation += value; // Agregar el valor a la relación
    document.getElementById("relation").innerText = relation; // Mostrar la relación en pantalla
}

function generatePairs() {
    const setInput = document.getElementById("setInput").value;
    const S = setInput.split(',').map(item => item.trim());
    const orderedPairs = generatePairsFromRelation(S);
    
    document.getElementById("orderedPairs").innerText = orderedPairs.length > 0 ? orderedPairs.join(', ') : "No se generaron pares ordenados.";
    
    const properties = checkProperties(S, orderedPairs);
    document.getElementById("properties").innerText = properties;
}

function generatePairsFromRelation(S) {
    const orderedPairs = new Set();
    try {
        for (let x of S) {
            for (let y of S) {
                // Reemplazar x e y en la relación
                const expression = relation.replace(/x/g, x).replace(/y/g, y);
                
                // Evaluar la relación
                if (evaluateExpression(expression)) {
                    orderedPairs.add(`(${x}, ${y})`);
                }
            }
        }
    } catch (error) {
        document.getElementById("orderedPairs").innerText = "Error en la expresión de relación. Asegúrate de que sea válida.";
        console.error("Error en la evaluación de la expresión: ", error);
        return [];
    }
    return Array.from(orderedPairs);
}

// Nueva función para evaluar la expresión
function evaluateExpression(expr) {
    try {
        return new Function(`return ${expr}`)(); // Usar Function para evaluar la expresión
    } catch (error) {
        console.error("Error al evaluar la expresión:", error);
        return false; // Si hay error, retorna false
    }
}

function checkProperties(S, orderedPairs) {
    const pairs = Array.from(orderedPairs).map(pair => pair.replace(/[()]/g, '').split(', '));
    
    const isReflexive = S.every(x => pairs.includes([x, x].toString()));
    const isSymmetric = pairs.every(([x, y]) => pairs.includes([y, x].toString()));
    const isTransitive = pairs.every(([x, y]) => 
        pairs.every(([y2, z]) => {
            if (y === y2) {
                return pairs.includes([x, z].toString());
            }
            return true;
        })
    );

    let result = '';
    result += isReflexive ? 'La relación es reflexiva. ' : 'La relación no es reflexiva. ';
    result += isSymmetric ? 'La relación es simétrica. ' : 'La relación no es simétrica. ';
    result += isTransitive ? 'La relación es transitiva. ' : 'La relación no es transitiva. ';
    
    result += (isReflexive && isSymmetric && isTransitive) ? 'La relación es equivalente.' : 'La relación no es equivalente.';
    
    return result;
}

function clearFields() {
    relation = ""; // Reiniciar la relación
    document.getElementById("relation").innerText = ""; // Limpiar la relación en pantalla
    document.getElementById("setInput").value = ""; // Limpiar el input
    document.getElementById("orderedPairs").innerText = ""; // Limpiar pares ordenados
    document.getElementById("properties").innerText = ""; // Limpiar propiedades
}







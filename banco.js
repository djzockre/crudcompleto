window.addEventListener('load', cargar);

var db = openDatabase("myDB", "1.0", "TiPS Database Example", 2 * 1024 * 1024);



function cargar(){    
    
    document.getElementById('btn-salvar').addEventListener('click', guardar);
    document.getElementById('btn-deletar').addEventListener('click', deletar);
    
    db.transaction(function(tx) {
        //tx.executeSql("DROP TABLE myTable" );
        tx.executeSql("CREATE TABLE IF NOT EXISTS tabla ( id INTEGER PRIMARY KEY,nombre TEXT,pwd TEXT, email TEXT)" );
//        tx.executeSql('INSERT INTO myTable ( nombre,pwd,email) VALUES ("a", "b", "c")');
    });
    
    mostrar();
    
}   

function guardar(){
    var id = document.getElementById('field-id').value;
    var nombre = document.getElementById('field-name').value;
    var pass = document.getElementById('field-pass').value;
    var mail = document.getElementById('field-mail').value;

    db.transaction(function(tx) {
        if(id){
            tx.executeSql('UPDATE tabla SET nombre=?, pwd=?, email=? WHERE id=?', [nombre,pass,mail,id],null);
        }else{
            tx.executeSql('INSERT INTO tabla( nombre,pwd,email) VALUES (?, ?, ?)', [nombre,pass,mail]);
        }
    });

    mostrar();
    limpiarCampo();
    inputSHOW(false);
}

function mostrar(){        
    var table = document.getElementById('tbody-register');

    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM tabla', [], function (tx, resultado) {
            var rows = resultado.rows;
            var tr = '';
            for(var i = 0; i < rows.length; i++){
                    tr += '<tr>';
                    tr += '<td onClick="actualizar(' + rows[i].id + ')">' + rows[i].nombre + '</td>';
                    tr += '<td>' + rows[i].pwd + '</td>';
                    tr += '<td>' + rows[i].email + '</td>';
                    tr += '</tr>';                   
            }
                table.innerHTML = tr; 

        }, null);
    });
}

function actualizar(_id){   
    
    var id = document.getElementById('field-id');
    var nombre = document.getElementById('field-name');
    var pass = document.getElementById('field-pass');
    var mail = document.getElementById('field-mail');
    
    id.value = _id;
    
    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM tabla WHERE id=?', [_id], function (tx, resultado) {
            var rows = resultado.rows[0];

            nombre.value = rows.nombre ;
            pass.value = rows.pwd ;
            mail.value = rows.email ;
        });
    });
    inputSHOW(true);
}

function deletar(){
    
    var id = document.getElementById('field-id').value;
    
    db.transaction(function(tx) {
        tx.executeSql("DELETE FROM tabla WHERE id=?", [id]);
    });
    
    mostrar();
    limpiarCampo();
    inputSHOW(false);
}

var nuevoId;
var dataBase = openDatabase('itemDB','1.0','itemDB',1*1024*1024);

function limpiar() {
  document.getElementById("item").value = "";
  document.getElementById("precio").value = "";
}

//FUNCIONALIDAD DE LOS BOTENES

//ELIMINAR REGISTRO 
function eliminarRegistro(){
    $(document).one('click','button[type = "button"]',function(event){
        let id = this.id;
        var lista = [];
        $("#listaProductos").each(function(){
            var celdas = $(this).find('tr.Reg_'+id);
            celdas.each(function(){
                var registro = $(this).find('span.mid');
                registro.each(function(){
                    lista.push($(this).html())
                });
            });
        });
        nuevoId = lista[0].substring(1);
        // var nuevoId = typeof lista?.[0] === 'string' ? lista[0].substring(1) : '';
        dataBase.transaction(function(transaction){
            var sql = "DELETE FROM productos WHERE id="+nuevoId+";"
            transaction.executeSql(sql,undefined,function(){
                alert("Registro borrado satisfactoriamente, por favor actualice la tabla");
            },function(transaction,err){
                alert(err.message);
            })
        })
    });
}

//EDITAR REGISTRO
function editar(){
    $(document).one('click','button[type = "button"]',function(event){
        let id = this.id;
        var lista = [];
        $("#listaProductos").each(function(){
            var celdas = $(this).find('tr.Reg_'+id);
            celdas.each(function(){
                var registro = $(this).find('span');
                registro.each(function(){
                    lista.push($(this).html())
                });
            });
        });
        document.getElementById("item").value=lista[1];
        document.getElementById("precio").value=lista[2].slice(0,-5);
        nuevoId=lista[0].substring(1);
    });
}

$(function () {

    //CREAR LA TABLA DE PRODUCTOS
    $("#crear").click(function () {
        dataBase.transaction(function (trasaction) {
            var sql ="CREATE TABLE productos(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, item VARCHAR (100) NOT NULL,precio DECIMAL(5,2) NOT NULL)";
            trasaction.executeSql(sql,undefined,function () {
                alert("Tabla creada satisfactoriamente");
            },
            function (trasaction, err) {
                alert(err.message);
            });
        });
    });

    //CARGAR LA LISTA DE PRODUCTOS
    $("#listar").click(function () {
        cargarDatos();
    });

    //FUNCION PARA LISTAR Y PINTAR TABLA DE PRODUCTOS DE PAGINA WED
    function cargarDatos() {
        $("#listaProductos").children().remove();
            dataBase.transaction(function (trasaction) {
                var sql = "SELECT * FROM productos ORDER BY id DESC";
                trasaction.executeSql(sql,undefined,function (trasaction, result) {
                    if (result.rows.length) {
                        $("#listaProductos").append("<tr><th>Código</th><th>Producto</th><th>Precio</th><th><th></th></th</tr>");
                        for (var i = 0; i < result.rows.length; i++) {
                            var row = result.rows.item(i);
                            var item = row.item;
                            var id = row.id;
                            var precio = row.precio;
                            $("#listaProductos").append(
                            '<tr id="fila' + id +'"class="Reg_A' + id +'"><td><span class="mid">A' + id +'</span></td><td><span>' + item +'</span></td><td><span>' + precio +' COP$</span></td><td><button type="button" id="A'+id+'" class="btn btn-success" onclick="editar()"><img src="libs/img/edit.png"/></button></td><td><button type="button" id="A'+id+'" class="btn btn-danger" onclick="eliminarRegistro()"><img src="libs/img/delete.png"/></button></td></tr>');
                        }
                    } else {
                        $("#listaProductos").append('<tr><td colspan="5" align="center">No existen registros de productos </td></tr>');
                    }
                },
                function (trasaction, err) {
                    alert(err.message);
                });
            });
    }
    
    //INSERTAR REGISTRO
    $("#insertar").click(function () {
        var item = $("#item").val();
        var precio = $("#precio").val();
        dataBase.transaction(function (trasaction) {
            var sql = "INSERT INTO productos(item,precio) VALUES(?,?)";
            trasaction.executeSql(sql,[item, precio],function() {},function (trasaction, err) {
                alert(err.message);
            });
        });
        limpiar();
        cargarDatos();
    });
    //MODIFICAR UN REGISTRO
    $("#modificar").click(function(){
        var nprod = $("#item").val();
        var nprecio = $("#precio").val();

        dataBase.transaction(function(transaction){
            var sql="UPDATE productos SET item='"+ nprod +"',precio='"+ nprecio +"'WHERE id="+ nuevoId +";"
            transaction.executeSql(sql,undefined,function(){
                cargarDatos();
                limpiar();
            },function(transaction,err){
                alert(err.message);
            });
        });
    });

    //BORRAR TODA LA LISTA DE REGISTROS
    $("#borrarTodo").click(function(){
        if(!confirm("Estas seguro de borrar la tabla?; los datos se perderan permanentemente",""))
        return;
        dataBase.transaction(function(transaction){
            var sql = "DROP TABLE productos";
            transaction.executeSql(sql,undefined,function(){
                alert("Tabla borrada satisfactoriamente, por favor, actualice la pagina");
            },function(transaction, err){
                alert(err.message);
            });
        });
    });


});

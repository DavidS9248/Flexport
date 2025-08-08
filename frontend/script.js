document.addEventListener("DOMContentLoaded", () => {
  const lista = document.getElementById("lista-vehiculos");
  const form = document.getElementById("form-vehiculo");

  const mostrarVehiculos = () => {
    
    const vehiculos = [
      { marca: "Toyota", modelo: "Corolla", año: 2021, precio: 16000, imagenUrl: "https://example.com/car.jpg" }
    ];

    lista.innerHTML = "";
    vehiculos.forEach(v => {
      const div = document.createElement("div");
      div.className = "vehiculo";
      div.innerHTML = `
        <h3>${v.marca} ${v.modelo}</h3>
        <p>Año: ${v.año}</p>
        <p>Precio Inicial: $${v.precio}</p>
        <img src="${v.imagenUrl}" alt="imagen" style="width: 100%">
      `;
      lista.appendChild(div);
    });
  };

  form.addEventListener("submit", e => {
    e.preventDefault();
    const nuevoVehiculo = {
      marca: form.marca.value,
      modelo: form.modelo.value,
      año: parseInt(form.anio.value),
      precio: parseFloat(form.precio.value),
      imagenUrl: form.imagen.value
    };
   
    console.log("Vehículo agregado:", nuevoVehiculo);
    alert("Vehículo agregado (modo prueba)");
    form.reset();
  });

  mostrarVehiculos();
});

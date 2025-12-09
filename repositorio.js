let db;

const req = indexedDB.open("PlataformaApps", 1);

req.onupgradeneeded = e => {
    const db = e.target.result;
    db.createObjectStore("apps", { keyPath: "id", autoIncrement: true });
};

req.onsuccess = e => {
    db = e.target.result;
    cargarApps();
};

document.getElementById("guardarApp").onclick = () => {
    const nombre = document.getElementById("nombreApp").value;
    const autor = document.getElementById("autorApp").value;
    const url = document.getElementById("urlApp").value;

    const tx = db.transaction("apps", "readwrite");
    const store = tx.objectStore("apps");

    store.add({ nombre, autor, url });

    tx.oncomplete = () => {
        cargarApps();
        document.getElementById("nombreApp").value = "";
        document.getElementById("autorApp").value = "";
        document.getElementById("urlApp").value = "";
    };
};

function cargarApps() {
    const tx = db.transaction("apps", "readonly");
    const store = tx.objectStore("apps");

    const req = store.getAll();

    req.onsuccess = () => {
        const lista = document.getElementById("listaApps");
        lista.innerHTML = "";

        req.result.forEach(app => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${app.nombre}</strong> — ${app.autor}
                <a href="${app.url}" target="_blank">Descargar</a>
            `;
            lista.appendChild(li);
        });
    };
}

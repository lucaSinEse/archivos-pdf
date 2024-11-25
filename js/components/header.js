document.write(`
  <header>
    <div class="button-container">
      <button id="hamburger-button" onclick="abrirNav()">&#9776;</button>
    </div>
    <div class="logo">
      <img src="./images/logo-empresa.webp">
    </div>
    <nav>
      <ul class="nav-list">
        <li>
          <a href="./index.html">Tramites</a>
        </li>
        <li>
          <a href="./TipoTramites.html">Tipos de Tramites</a>
        </li>
      </ul>
    </nav>

    <div class="nav-hamburguesa" id="nav-hamburguesa">
    <ul class="nav-list">
      <li>
        <a href="./index.html">Tramites</a>
      </li>
      <li>
        <a href="./TipoTramites.html">Tipos de Tramites</a>
      </li>
    </ul>
  </div>
  </header>
  `);

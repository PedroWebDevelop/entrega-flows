// src/app.js
import $ from '/portal/resources/js/jquery/jquery.js';

// Usando jQuery para inserir texto
$('.fluig-style-guide').html('<h1>Hello World</h1>');

// Usando Fluig Style Guide para criar um botão estilizado
$('.fluig-style-guide').append('<button class="btn btn-primary">Botão Fluig</button>');

// Usando jQuery UI para criar um diálogo
$('<div title="jQuery UI Dialog">Este é um diálogo do jQuery UI!</div>').dialog();

// Usando Mustache para renderizar um template
const template = '<p>Olá, {{name}}!</p>';
const rendered = Mustache.render(template, { name: 'Pedro' });
$('.fluig-style-guide').append(rendered);
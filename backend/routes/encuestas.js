// backend/routes/encuestas.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const express = require('express');
const router = express.Router();

// Inicialización de Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

router.post('/', async (req, res) => {
  try {
    const {
      sucursal,
      vendedor,
      calificacion,
      detalle,
      campana,
      fuente,
      telefono,
      canal
    } = req.body;

    // Validación mínima
    if (!sucursal || !vendedor || !calificacion || !canal) {
      return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }

    // Asegurar que telefono no sea null para evitar errores de restricción
    const telefonoInsert = telefono || '';

    function getArgentinaISOString() {
      const local = new Date().toLocaleString('en-US', {
        timeZone: 'America/Argentina/Cordoba'
      });
      const dt = new Date(local);
      const pad = n => String(n).padStart(2, '0');
      const year   = dt.getFullYear();
      const month  = pad(dt.getMonth() + 1);
      const day    = pad(dt.getDate());
      const hour   = pad(dt.getHours());
      const minute = pad(dt.getMinutes());
      const second = pad(dt.getSeconds());
      const milli  = String(dt.getMilliseconds()).padStart(3, '0');
      return `${year}-${month}-${day}T${hour}:${minute}:${second}.${milli}-03:00`;
    }

    const { data, error: supaError } = await supabase
      .from('encuestas')
      .insert([
        {
          sucursal,
          vendedor,
          calificacion,
          detalle: detalle || null,
          campana: campana || null,
          fuente: fuente || null,
          telefono: telefonoInsert,
          canal,
          fecha: getArgentinaISOString()
        }
      ]);

    if (supaError) {
      console.error('Supabase error:', supaError);
      return res.status(500).json({ error: supaError.message });
    }

    // data podría ser null o vacío si algo raro sucede
    const inserted = Array.isArray(data) && data.length > 0 ? data[0] : null;
    return res.status(201).json({ success: true, encuesta: inserted });
  } catch (err) {
    console.error('Error insertando encuesta:', err);
    return res.status(500).json({ error: 'Error en el servidor.' });
  }
});

module.exports = router;
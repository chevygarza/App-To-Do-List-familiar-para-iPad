# To-Do Familiar - App para iPad Central

Una aplicación web moderna y amigable para gestionar tareas familiares diarias, optimizada para iPad central en el hogar.

## 🏠 Características

- **Interfaz táctil optimizada** para iPad
- **Tareas fijas diarias** para diferentes miembros de la familia
- **Tareas personalizadas** que se pueden agregar
- **Persistencia local** de datos (no se pierden al cerrar)
- **Diseño responsivo** y moderno
- **Estadísticas en tiempo real** de tareas completadas/pendientes
- **Resumen diario automático** a las 8:00 PM con tareas pendientes
- **Sistema de puntos** y scoreboard mensual
- **Edición de tareas** con modal elegante

## 👥 Usuarios Predefinidos

- **Todos**: Tareas generales de la familia
- **Mamá**: Tareas específicas de la madre
- **Papá**: Tareas específicas del padre  
- **Hijo**: Tareas específicas del hijo
- **Hija**: Tareas específicas de la hija

## 📋 Tareas Diarias Incluidas

### Para Todos
- Revisar el calendario familiar
- Planificar comidas del día
- Revisar lista de compras

### Para Mamá
- Preparar desayuno
- Revisar ropa para lavar
- Planificar cena
- Revisar medicamentos

### Para Papá
- Revisar correos importantes
- Verificar finanzas del hogar
- Revisar mantenimiento casa
- Planificar actividades familiares

### Para Hijos
- Hacer la cama
- Organizar mochila
- Hacer tareas escolares
- Limpiar habitación

## 🚀 Cómo Usar

1. **Abrir la aplicación**: Simplemente abre el archivo `index.html` en Safari del iPad
2. **Seleccionar usuario**: Toca el botón del miembro de la familia
3. **Ver tareas diarias**: Las tareas fijas aparecen en la sección izquierda
4. **Agregar tareas personalizadas**: Usa el campo de texto en la sección derecha
5. **Marcar como completada**: Toca el círculo junto a la tarea
6. **Editar tarea**: Toca el ícono de editar (lápiz)
7. **Eliminar tarea**: Toca el ícono de eliminar (basura)
8. **Ver resumen del día**: Toca el botón "Ver Resumen del Día" en la parte inferior
9. **Editar tarea**: Toca el ícono de lápiz junto a la tarea
10. **Ver scoreboard**: Toca el botón "Scoreboard" para ver los puntos del mes

## 💾 Almacenamiento

- Los datos se guardan automáticamente en el navegador
- No se requiere conexión a internet después de la carga inicial
- Los datos persisten entre sesiones

## 📊 Resumen Diario

- **Automático**: Se muestra automáticamente a las 8:00 PM
- **Manual**: Puedes ver el resumen en cualquier momento con el botón "Ver Resumen del Día"
- **Contenido**: Muestra todas las tareas pendientes organizadas por usuario
- **Acciones**: Puedes cerrar el resumen o ir directamente a ver todas las tareas

## 🏆 Sistema de Puntos y Scoreboard

- **Puntos por tarea**: Cada tarea completada otorga 10 puntos
- **Notificaciones**: Aparece una notificación cuando alguien gana puntos
- **Scoreboard mensual**: Ranking de puntos del mes actual
- **Logros**: Badges según la cantidad de puntos acumulados
  - 🏆 Maestro (100+ puntos)
  - 🥈 Experto (50+ puntos)
  - 🥉 Aprendiz (20+ puntos)
  - ⭐ Principiante (0+ puntos)
- **Reinicio mensual**: Los puntos se reinician automáticamente cada mes
- **Ganador destacado**: El primer lugar aparece con corona y fondo especial

## ✏️ Edición de Tareas

- **Modal elegante**: Interfaz moderna para editar tareas
- **Acceso fácil**: Ícono de lápiz visible en cada tarea
- **Validación**: No permite guardar tareas vacías
- **Atajos de teclado**: Enter para guardar, Escape para cancelar

## 🎨 Personalización

### Agregar Nuevos Usuarios
Edita el archivo `script.js` y agrega nuevos usuarios en la función `getDailyTasks()`:

```javascript
nuevoUsuario: [
    { id: 'nuevo-daily-1', text: 'Nueva tarea diaria', user: 'nuevoUsuario', daily: true },
    // ... más tareas
]
```

### Cambiar Tareas Diarias
Modifica las tareas en la función `getDailyTasks()` del archivo `script.js`.

### Personalizar Colores
Edita el archivo `styles.css` para cambiar los colores y el diseño.

## 📱 Optimización para iPad

- Botones grandes para uso táctil
- Interfaz adaptada a pantalla completa
- Gestos táctiles optimizados
- Fuentes legibles en pantalla grande

## 🔧 Instalación

1. Descarga todos los archivos en una carpeta
2. Abre `index.html` en Safari del iPad
3. Para mejor experiencia, agrega la página a la pantalla de inicio:
   - Toca el botón compartir en Safari
   - Selecciona "Agregar a pantalla de inicio"

## 📄 Archivos Incluidos

- `index.html` - Estructura principal de la aplicación
- `styles.css` - Estilos y diseño
- `script.js` - Funcionalidad y lógica
- `README.md` - Este archivo de instrucciones

## 🎯 Consejos de Uso

- **Ubicación ideal**: iPad central en la cocina o sala familiar
- **Horario recomendado**: Revisar por la mañana y antes de dormir
- **Mantenimiento**: Las tareas diarias se reinician automáticamente
- **Colaboración**: Toda la familia puede ver y marcar tareas

## 🔄 Actualizaciones Futuras

Posibles mejoras que se pueden implementar:
- Sincronización entre dispositivos
- Notificaciones push
- Calendario integrado
- Lista de compras automática
- Estadísticas semanales/mensuales
- Temas personalizables

---

¡Disfruta organizando tu hogar con To-Do Familiar! 🏡✨ 
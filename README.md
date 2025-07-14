# To-Do Familiar - App para iPad Central

Una aplicación web moderna y amigable para gestionar tareas familiares diarias, optimizada para iPad central en el hogar con **sincronización automática entre dispositivos**.

## 🔐 **Nueva Funcionalidad: Autenticación y Sincronización**

### **Características de Seguridad:**
- ✅ **Contraseña familiar única** para acceder a la app
- ✅ **Sincronización automática** entre todos los dispositivos
- ✅ **Datos en tiempo real** usando Firebase
- ✅ **Sin registro** de usuarios individuales
- ✅ **Sesión persistente** (no necesitas ingresar contraseña cada vez)

### **Contraseña por Defecto:**
- **Contraseña**: `familia2024`
- **Puedes cambiarla** editando el archivo `script.js`

## 🏠 Características

- **Interfaz táctil optimizada** para iPad
- **Tareas fijas diarias** para diferentes miembros de la familia
- **Tareas personalizadas** que se pueden agregar
- **Sincronización automática** entre dispositivos
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

### **Primera vez:**
1. **Abrir la aplicación**: Ve a la URL de la app
2. **Ingresar contraseña**: Escribe `familia2024`
3. **¡Listo!** Acceso inmediato a la app

### **Uso diario:**
1. **Abrir la aplicación**: La app se abre automáticamente (sin contraseña)
2. **Seleccionar usuario**: Toca el botón del miembro de la familia
3. **Ver tareas diarias**: Las tareas fijas aparecen en la sección izquierda
4. **Agregar tareas personalizadas**: Usa el campo de texto en la sección derecha
5. **Marcar como completada**: Toca el círculo junto a la tarea
6. **Editar tarea**: Toca el ícono de editar (lápiz)
7. **Eliminar tarea**: Toca el ícono de eliminar (basura)
8. **Ver resumen del día**: Toca el botón "Ver Resumen del Día" en la parte inferior
9. **Ver scoreboard**: Toca el botón "Scoreboard" para ver los puntos del mes

## 🔄 Sincronización Automática

### **¿Cómo funciona?**
- **Tiempo real**: Los cambios aparecen en todos los dispositivos en 1-2 segundos
- **Automático**: No necesitas hacer nada, la sincronización es transparente
- **Confiable**: Usa Firebase (Google) para garantizar que los datos no se pierdan

### **Escenario de uso:**
1. **iPad de la cocina**: Mamá agrega "Comprar leche"
2. **Automáticamente** (en 1-2 segundos):
   - Papá ve la tarea en su iPhone
   - Hijo ve la tarea en su iPad
   - Hija ve la tarea en su computadora

## 💾 Almacenamiento

- **Firebase**: Los datos se guardan en la nube de Google
- **Sincronización automática** entre todos los dispositivos
- **Sin límite** de dispositivos conectados
- **Datos seguros** y respaldados automáticamente

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

## 🔧 Personalización

### **Cambiar Contraseña Familiar**
Edita el archivo `script.js` y cambia esta línea:
```javascript
this.familyPassword = 'familia2024'; // Cambia por tu nueva contraseña
```

### **Agregar Nuevos Usuarios**
Edita el archivo `script.js` y agrega nuevos usuarios en la función `getDailyTasks()`:

```javascript
nuevoUsuario: [
    { id: 'nuevo-daily-1', text: 'Nueva tarea diaria', user: 'nuevoUsuario', daily: true },
    // ... más tareas
]
```

### **Cambiar Tareas Diarias**
Modifica las tareas en la función `getDailyTasks()` del archivo `script.js`.

### **Personalizar Colores**
Edita el archivo `styles.css` para cambiar los colores y el diseño.

## 📱 Optimización para iPad

- Botones grandes para uso táctil
- Interfaz adaptada a pantalla completa
- Gestos táctiles optimizados
- Fuentes legibles en pantalla grande

## 🔧 Instalación

1. **Abrir la aplicación**: Ve a la URL de GitHub Pages
2. **Ingresar contraseña**: `familia2024`
3. **Para mejor experiencia**, agrega la página a la pantalla de inicio:
   - Toca el botón compartir en Safari
   - Selecciona "Agregar a pantalla de inicio"

## 📄 Archivos Incluidos

- `index.html` - Estructura principal de la aplicación
- `styles.css` - Estilos y diseño
- `script.js` - Funcionalidad, autenticación y sincronización
- `README.md` - Este archivo de instrucciones
- `FULLSCREEN_SETUP.md` - Guía para modo app nativa

## 🎯 Consejos de Uso

- **Ubicación ideal**: iPad central en la cocina o sala familiar
- **Horario recomendado**: Revisar por la mañana y antes de dormir
- **Mantenimiento**: Las tareas diarias se reinician automáticamente
- **Colaboración**: Toda la familia puede ver y marcar tareas
- **Sincronización**: Los cambios aparecen automáticamente en todos los dispositivos

## 🔄 Actualizaciones Futuras

Posibles mejoras que se pueden implementar:
- Notificaciones push
- Calendario integrado
- Lista de compras automática
- Estadísticas semanales/mensuales
- Temas personalizables
- Usuarios individuales con contraseñas separadas

## 🔐 Seguridad

- **Contraseña familiar**: Protege el acceso a la app
- **Datos encriptados**: Firebase encripta automáticamente los datos
- **Sin datos personales**: Solo se guardan tareas y puntos
- **Acceso controlado**: Solo familia con la contraseña puede acceder

---

¡Disfruta organizando tu hogar con To-Do Familiar! 🏡✨ 
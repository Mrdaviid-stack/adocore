import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import Alpine from "alpinejs";

import modalLoader from './components/modalLoader';

Alpine.data('modalLoader', modalLoader)

window.Alpine = Alpine

Alpine.start()
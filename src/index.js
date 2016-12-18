import 'loud-rejection/register';

require('./globals');

const BootApp = requireF('services/BootApp');

const bootApp = new BootApp();
bootApp.boot();

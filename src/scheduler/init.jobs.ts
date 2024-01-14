import CronTime from 'cron-time-generator';

import { Scheduler } from './index';
import { PatchFlightsJob } from './defined.jobs/flight.patch.job';
import { ArchiveFlightJob } from './defined.jobs/flight.archive.job';
import { SyncActiveFlightsJob } from './defined.jobs/flight.sync.job';
import { CreateAircraftJob } from './defined.jobs/aircraft.create.job';
import { FlightAlertSyncJob } from './defined.jobs/flight.alert.sync.job';
import { CreateAircraftMetaJob } from './defined.jobs/aircraft.meta.create.job';
import { SyncActiveAircraftLocationJob } from './defined.jobs/aircraft.sync.job';
import { UserPreferenceCreateJob } from './defined.jobs/user.preference.create.job';
import { RemindCheckInFlightsJob } from './defined.jobs/flight.check.in.reminder.job';

const EVERY_5_MIN = CronTime.every(5).minutes();

Scheduler.define(SyncActiveFlightsJob);
Scheduler.define(PatchFlightsJob);
Scheduler.define(ArchiveFlightJob);
Scheduler.define(SyncActiveAircraftLocationJob);
Scheduler.define(RemindCheckInFlightsJob);
Scheduler.define(UserPreferenceCreateJob);
Scheduler.define(CreateAircraftJob);
Scheduler.define(FlightAlertSyncJob);
Scheduler.define(CreateAircraftMetaJob);

Scheduler.schedule(EVERY_5_MIN, new SyncActiveFlightsJob());
Scheduler.schedule(EVERY_5_MIN, new PatchFlightsJob());
Scheduler.schedule(EVERY_5_MIN, new SyncActiveAircraftLocationJob());
Scheduler.schedule(CronTime.every(1).hours(), new ArchiveFlightJob());
Scheduler.schedule(CronTime.every(10).minutes(), new RemindCheckInFlightsJob());

Scheduler.start();

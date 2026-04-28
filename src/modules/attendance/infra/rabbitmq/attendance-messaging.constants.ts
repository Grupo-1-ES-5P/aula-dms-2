export const ATTENDANCE_REGISTERED_EXCHANGE = "attendance.registered.exchange";
export const ATTENDANCE_REGISTERED_ROUTING_KEY = "attendance.registered";

export const ATTENDANCE_CONSUMER_QUEUE_NAMES = [
  "attendance.academic-students.created.queue",
  "attendance.academic-students.updated.queue",
  "attendance.academic-students.deleted.queue",
] as const;

export interface AttendanceQueueBinding {
  queueName: (typeof ATTENDANCE_CONSUMER_QUEUE_NAMES)[number];
  exchangeName: string;
  routingKey: string;
}

export const ATTENDANCE_CONSUMER_BINDINGS: AttendanceQueueBinding[] = [
  {
    queueName: "attendance.academic-students.created.queue",
    exchangeName: "academic.students.created.exchange",
    routingKey: "student.created",
  },
  {
    queueName: "attendance.academic-students.updated.queue",
    exchangeName: "academic.students.updated.exchange",
    routingKey: "student.updated",
  },
  {
    queueName: "attendance.academic-students.deleted.queue",
    exchangeName: "academic.students.deleted.exchange",
    routingKey: "student.deleted",
  },
];

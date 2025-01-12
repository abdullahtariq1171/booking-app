using System;
using System.Collections.Generic;
using Accessibility.Domain.Schedules;
using Accessibility.Domain.SharedKernel;
using Core.Queries;

namespace Accessibility.Application.Availabilities.Queries.GetAvailabilites
{
    public class GetAvailabilitiesQuery : IQuery<IEnumerable<AvailabilityDto>>
    {
        public GetAvailabilitiesQuery(FacilityId facilityId, ScheduleId scheduleId, DateTime? startTime, DateTime? endTime)
        {
            FacilityId = facilityId;
            ScheduleId = scheduleId;
            StartTime = startTime;
            EndTime = endTime;
        }

        public GetAvailabilitiesQuery(FacilityId facilityId, ScheduleId scheduleId, DateTime? startTime, DateTime? endTime, EmployeeId employeeId)
            : this(facilityId, scheduleId, startTime, endTime)
        {
            EmployeeId = employeeId;
        }

        public FacilityId FacilityId { get; }
        public ScheduleId ScheduleId { get; }
        public DateTime? StartTime { get; }
        public DateTime? EndTime { get; }
        public EmployeeId EmployeeId { get; }
    }
}

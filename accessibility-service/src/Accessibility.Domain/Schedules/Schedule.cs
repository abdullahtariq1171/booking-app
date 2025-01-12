using System;
using System.Collections.Generic;
using System.Linq;
using Accessibility.Domain.Schedules.Availabilities;
using Accessibility.Domain.Schedules.Events;
using Accessibility.Domain.Schedules.Rules;
using Core.Domain;
using Accessibility.Domain.SharedKernel;

namespace Accessibility.Domain.Schedules
{
    public class Schedule : AggregateRootBase
    {
        public ScheduleId Id { get; }
        public FacilityId FacilityId { get; private set; }
        private string name;
        private DateTime startDate;
        private DateTime endDate;
        private List<Availability> availabilities;
        private EmployeeId creatorId;
        private DateTime creationDate;
        private DateTime? modifyDate;

        public Schedule()
        {
            availabilities = new List<Availability>();
        }

        public Schedule(
            ISchedulePeriodOfTimeChecker schedulePeriodOfTimeChecker,
            FacilityId facilityId, string name, DateTime startDate, DateTime endDate, EmployeeId creatorId)
        {
            CheckRule(new NewSchedulePeriodOfTimeMustBeAvailableRule(schedulePeriodOfTimeChecker, facilityId, startDate, endDate));

            Id = new ScheduleId(Guid.NewGuid());
            SetData(facilityId, name, startDate, endDate, creatorId);
            creationDate = DateTime.Now;

            AddDomainEvent(new ScheduleCreatedEvent(Id));
        }

        public void OverrideAvailabilitiesInPeriodOfTime(PeriodOfTime periodOfTime, IEnumerable<AvailabilityData> availabilities)
        {
            CheckRule(new OverridingAvailabilitiesMustFitPeriodOfTimeRule(periodOfTime, availabilities));
            CheckRule(new WorkerAvailabilityCanNotDuplicateInPeriodOfTimeRule(availabilities));

            var oldAvailabilities = this.availabilities.Where(a => a.PeriodOfTime.IsInRange(periodOfTime)).ToList();

            var foundAvailabilities = new List<Availability>();

            foreach (var availability in availabilities)
            {
                var old = oldAvailabilities.FirstOrDefault(a =>
                    a.EmployeeId == availability.EmployeeId &&
                    a.PeriodOfTime.Equals(availability.PeriodOfTime));
                
                if (old == null)
                {
                    this.availabilities.Add(Availability.Create(availability.EmployeeId, availability.PeriodOfTime, availability.CreatorId));
                }
                else
                {
                    foundAvailabilities.Add(old);
                }
            }

            foreach (var old in oldAvailabilities)
            {
                if (!foundAvailabilities.Contains(old))
                {
                    this.availabilities.Remove(old);
                }
            }
        }

        public void Modify(
            ISchedulePeriodOfTimeChecker schedulePeriodOfTimeChecker,
            string name, DateTime startDate, DateTime endDate, EmployeeId creatorId)
        {
            CheckRule(new ModifiedSchedulePeriodOfTimeMustBeAvailableRule(schedulePeriodOfTimeChecker, FacilityId, Id, startDate, endDate));

            SetData(FacilityId, name, startDate, endDate, creatorId);
            
            modifyDate = DateTime.Now;
            IncreaseVersion();
        }

        public void CreateCorrection(List<AvailabilityData> corrections)
        {
            CheckRule(new WorkerAvailabilityCanNotDuplicateInPeriodOfTimeRule(corrections));

            var currentPriority = availabilities.Max(a => a.Priority);
            var nextPriority = (short)(currentPriority + 1);

            foreach (var correction in corrections)
            {
                var corrected = availabilities.FirstOrDefault(a =>
                    a.PeriodOfTime.HasCommonPeriodWithEdges(correction.PeriodOfTime));
                
                if (corrected != null)
                {
                    corrected.Correct(correction.PeriodOfTime, nextPriority);
                }
                else
                {
                    availabilities.Add(Availability.Create(correction.EmployeeId, corrected.PeriodOfTime, correction.CreatorId));
                }
            }

            modifyDate = DateTime.Now;
            IncreaseVersion();

            AddDomainEvent(new ScheduleCorrectedEvent(Id));
        }

        private void SetData(FacilityId facilityId, string name, DateTime startDate, DateTime endDate, EmployeeId creatorId)
        {
            this.FacilityId = facilityId;
            this.name = name;
            this.startDate = startDate;
            this.endDate = endDate;
            this.creatorId = creatorId;
        }
    }
}

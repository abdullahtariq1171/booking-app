using System.Threading.Tasks;
using Accessibility.Application.Facilities.Commands.ChangeOfferStatus;
using Accessibility.Domain.SharedKernel;
using Management.Facilities.Events;
using MassTransit;
using MediatR;

namespace Accessibility.Application.Facilities.IntegrationEvents.EventHandling
{
    public class OfferActivatedConsumer : IConsumer<OfferActivated>
    {
        private readonly IMediator mediator;

        public OfferActivatedConsumer(IMediator mediator)
        {
            this.mediator = mediator;
        }

        public async Task Consume(ConsumeContext<OfferActivated> context)
        {
            var dto = context.Message.Dto;

            await mediator.Send(new ChangeOfferStatusCommand(
                new OfferId(dto.OfferId),
                dto.Status
            ));
        }
    }
}
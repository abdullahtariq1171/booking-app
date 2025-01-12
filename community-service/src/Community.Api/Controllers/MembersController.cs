using System;
using System.Net;
using System.Threading.Tasks;
using Community.Api.Members;
using Community.Application.Members.Commands.CreateMember;
using Community.Application.Members.Queries.GetMemberArchivalBookings;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Community.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MembersController : ControllerBase
    {
        private readonly IMediator mediator;

        public MembersController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpPost]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public async Task<IActionResult> Create(
            [FromBody] CreateMemberCommand request
        )
        {
            await mediator.Send(request);
            return Ok();
        }

        [HttpGet("{memberId}/[action]")]
        [ProducesResponseType(typeof(GetMemberArchivalBookingsResponse), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> Bookings(
            [FromRoute] Guid memberId
        )
        {
            var result = await mediator.Send(new GetMemberArchivalBookingsQuery(memberId));
            return Ok(new GetMemberArchivalBookingsResponse(result));
        }
    }
}

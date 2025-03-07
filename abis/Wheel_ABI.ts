export const Wheel_ABI = [
  {
    type: "impl",
    name: "WheelImpl",
    interface_name: "cloover::wheel::interfaces::IWheel",
  },
  {
    type: "struct",
    name: "cloover::wheel::types::WithdrawalCallData",
    members: [
      { name: "round_id", type: "core::integer::u32" },
      {
        name: "deposit_indices",
        type: "core::array::Array::<core::integer::u32>",
      },
    ],
  },
  {
    type: "interface",
    name: "cloover::wheel::interfaces::IWheel",
    items: [
      {
        type: "function",
        name: "deposit",
        inputs: [
          { name: "round_id", type: "core::integer::u32" },
          { name: "tickets_count", type: "core::integer::u32" },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "deposit_into_multiple_rounds",
        inputs: [
          { name: "starting_round_id", type: "core::integer::u32" },
          {
            name: "tickets_counts",
            type: "core::array::Array::<core::integer::u32>",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "claim_prizes",
        inputs: [
          {
            name: "round_ids",
            type: "core::array::Array::<core::integer::u32>",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "cancel",
        inputs: [],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "withdraw_deposits",
        inputs: [
          {
            name: "withdrawal_calldata",
            type: "core::array::Array::<cloover::wheel::types::WithdrawalCallData>",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "draw_winner",
        inputs: [],
        outputs: [],
        state_mutability: "external",
      },
    ],
  },
  {
    type: "impl",
    name: "WheelVRFProviderCallbackImpl",
    interface_name: "cloover::vrf_provider::interfaces::IVRFProviderCallback",
  },
  {
    type: "struct",
    name: "core::integer::u256",
    members: [
      { name: "low", type: "core::integer::u128" },
      { name: "high", type: "core::integer::u128" },
    ],
  },
  {
    type: "interface",
    name: "cloover::vrf_provider::interfaces::IVRFProviderCallback",
    items: [
      {
        type: "function",
        name: "consume_random",
        inputs: [{ name: "random_value", type: "core::integer::u256" }],
        outputs: [],
        state_mutability: "external",
      },
    ],
  },
  {
    type: "impl",
    name: "WheelSetterImpl",
    interface_name: "cloover::wheel::interfaces::IWheelSetter",
  },
  {
    type: "interface",
    name: "cloover::wheel::interfaces::IWheelSetter",
    items: [
      {
        type: "function",
        name: "cancel_multiple_rounds",
        inputs: [{ name: "number_of_rounds", type: "core::integer::u32" }],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "update_maximum_number_of_participants_per_round",
        inputs: [
          {
            name: "maximum_number_of_participants_per_round",
            type: "core::integer::u32",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "update_maximum_participant_tickets_per_round",
        inputs: [
          {
            name: "maximum_participant_tickets_per_round",
            type: "core::integer::u32",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "update_maximum_number_of_deposits_per_round",
        inputs: [
          {
            name: "maximum_number_of_deposits_per_round",
            type: "core::integer::u32",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "update_protocol_fee_bp",
        inputs: [{ name: "protocol_fee_bp", type: "core::integer::u16" }],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "update_protocol_fee_recipient",
        inputs: [
          {
            name: "protocol_fee_recipient",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "update_vrf_contract",
        inputs: [
          {
            name: "vrf_contract",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "update_round_duration",
        inputs: [{ name: "round_duration", type: "core::integer::u64" }],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "update_price_per_ticket",
        inputs: [{ name: "price_per_ticket", type: "core::integer::u256" }],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "toggle_outflow_allowed",
        inputs: [],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "toggle_pause",
        inputs: [],
        outputs: [],
        state_mutability: "external",
      },
    ],
  },
  {
    type: "impl",
    name: "WheelGetterImpl",
    interface_name: "cloover::wheel::interfaces::IWheelGetter",
  },
  {
    type: "enum",
    name: "core::bool",
    variants: [
      { name: "False", type: "()" },
      { name: "True", type: "()" },
    ],
  },
  {
    type: "struct",
    name: "cloover::wheel::types::Deposit",
    members: [
      { name: "amount", type: "core::integer::u256" },
      {
        name: "depositor",
        type: "core::starknet::contract_address::ContractAddress",
      },
      { name: "withdrawn", type: "core::bool" },
      { name: "current_ticket_index", type: "core::integer::u32" },
    ],
  },
  {
    type: "enum",
    name: "cloover::wheel::types::RoundStatus",
    variants: [
      { name: "None", type: "()" },
      { name: "Open", type: "()" },
      { name: "Drawn", type: "()" },
      { name: "Closed", type: "()" },
      { name: "Cancelled", type: "()" },
    ],
  },
  {
    type: "struct",
    name: "cloover::wheel::types::Round",
    members: [
      { name: "status", type: "cloover::wheel::types::RoundStatus" },
      {
        name: "maximum_number_of_participants",
        type: "core::integer::u32",
      },
      { name: "protocol_fee_bp", type: "core::integer::u16" },
      { name: "cutoff_time", type: "core::integer::u64" },
      { name: "drawn_at", type: "core::integer::u64" },
      { name: "number_of_participants", type: "core::integer::u32" },
      {
        name: "winner",
        type: "core::starknet::contract_address::ContractAddress",
      },
      { name: "price_per_ticket", type: "core::integer::u256" },
      { name: "total_deposits_amount", type: "core::integer::u256" },
      { name: "prizes_pool_amount", type: "core::integer::u256" },
      { name: "fees_amount", type: "core::integer::u256" },
      { name: "random_value", type: "core::integer::u256" },
      { name: "winning_ticket", type: "core::integer::u32" },
    ],
  },
  {
    type: "struct",
    name: "core::array::Span::<cloover::wheel::types::Deposit>",
    members: [
      {
        name: "snapshot",
        type: "@core::array::Array::<cloover::wheel::types::Deposit>",
      },
    ],
  },
  {
    type: "interface",
    name: "cloover::wheel::interfaces::IWheelGetter",
    items: [
      {
        type: "function",
        name: "get_round_duration",
        inputs: [],
        outputs: [{ type: "core::integer::u64" }],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_maximum_number_of_participants_per_round",
        inputs: [],
        outputs: [{ type: "core::integer::u32" }],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_maximum_number_of_deposits_per_round",
        inputs: [],
        outputs: [{ type: "core::integer::u32" }],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_protocol_fee_bp",
        inputs: [],
        outputs: [{ type: "core::integer::u16" }],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_protocol_fee_recipient",
        inputs: [],
        outputs: [
          { type: "core::starknet::contract_address::ContractAddress" },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_vrf_contract",
        inputs: [],
        outputs: [
          { type: "core::starknet::contract_address::ContractAddress" },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_price_per_ticket",
        inputs: [],
        outputs: [{ type: "core::integer::u256" }],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_rounds_count",
        inputs: [],
        outputs: [{ type: "core::integer::u32" }],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_maximum_participant_tickets_per_round",
        inputs: [],
        outputs: [{ type: "core::integer::u32" }],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_round_deposit",
        inputs: [
          { name: "round_id", type: "core::integer::u32" },
          { name: "deposit_index", type: "core::integer::u64" },
        ],
        outputs: [{ type: "cloover::wheel::types::Deposit" }],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_round_data",
        inputs: [{ name: "round_id", type: "core::integer::u32" }],
        outputs: [
          {
            type: "(cloover::wheel::types::Round, core::array::Span::<cloover::wheel::types::Deposit>)",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_is_outflow_allowed",
        inputs: [],
        outputs: [{ type: "core::bool" }],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_token",
        inputs: [],
        outputs: [
          { type: "core::starknet::contract_address::ContractAddress" },
        ],
        state_mutability: "view",
      },
    ],
  },
  {
    type: "impl",
    name: "WheelConstantsGetterImpl",
    interface_name: "cloover::wheel::interfaces::IWheelConstantsGetter",
  },
  {
    type: "interface",
    name: "cloover::wheel::interfaces::IWheelConstantsGetter",
    items: [
      {
        type: "function",
        name: "get_minimum_number_of_deposits_per_round",
        inputs: [],
        outputs: [{ type: "core::integer::u32" }],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_minimum_number_of_participants_per_round",
        inputs: [],
        outputs: [{ type: "core::integer::u32" }],
        state_mutability: "view",
      },
    ],
  },
  {
    type: "impl",
    name: "OwnableMixinImpl",
    interface_name: "openzeppelin_access::ownable::interface::OwnableABI",
  },
  {
    type: "interface",
    name: "openzeppelin_access::ownable::interface::OwnableABI",
    items: [
      {
        type: "function",
        name: "owner",
        inputs: [],
        outputs: [
          { type: "core::starknet::contract_address::ContractAddress" },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "transfer_ownership",
        inputs: [
          {
            name: "new_owner",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "renounce_ownership",
        inputs: [],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "transferOwnership",
        inputs: [
          {
            name: "newOwner",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "renounceOwnership",
        inputs: [],
        outputs: [],
        state_mutability: "external",
      },
    ],
  },
  {
    type: "impl",
    name: "PausableImpl",
    interface_name: "openzeppelin_security::interface::IPausable",
  },
  {
    type: "interface",
    name: "openzeppelin_security::interface::IPausable",
    items: [
      {
        type: "function",
        name: "is_paused",
        inputs: [],
        outputs: [{ type: "core::bool" }],
        state_mutability: "view",
      },
    ],
  },
  {
    type: "struct",
    name: "cloover::wheel::types::ConstructorCallData",
    members: [
      {
        name: "owner",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "maximum_number_of_participants_per_round",
        type: "core::integer::u32",
      },
      {
        name: "maximum_participant_tickets_per_round",
        type: "core::integer::u32",
      },
      {
        name: "maximum_number_of_deposits_per_round",
        type: "core::integer::u32",
      },
      { name: "round_duration", type: "core::integer::u64" },
      { name: "price_per_ticket", type: "core::integer::u256" },
      {
        name: "protocol_fee_recipient",
        type: "core::starknet::contract_address::ContractAddress",
      },
      { name: "protocol_fee_bp", type: "core::integer::u16" },
      {
        name: "vrf_contract",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "token",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    type: "constructor",
    name: "constructor",
    inputs: [
      { name: "data", type: "cloover::wheel::types::ConstructorCallData" },
    ],
  },
  {
    type: "event",
    name: "cloover::wheel::events::Events::ContractDeployed",
    kind: "struct",
    members: [
      {
        name: "owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "token",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "price_per_ticket",
        type: "core::integer::u256",
        kind: "data",
      },
      {
        name: "round_duration",
        type: "core::integer::u64",
        kind: "data",
      },
      {
        name: "protocol_fee_recipient",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "protocol_fee_bp",
        type: "core::integer::u16",
        kind: "data",
      },
      {
        name: "maximum_number_of_participants_per_round",
        type: "core::integer::u32",
        kind: "data",
      },
      {
        name: "maximum_number_of_deposits_per_round",
        type: "core::integer::u32",
        kind: "data",
      },
      {
        name: "maximum_participant_tickets_per_round",
        type: "core::integer::u32",
        kind: "data",
      },
      {
        name: "vrf_contract",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      { name: "is_outflow_allowed", type: "core::bool", kind: "data" },
    ],
  },
  {
    type: "event",
    name: "cloover::wheel::events::Events::VRFUpdated",
    kind: "struct",
    members: [
      {
        name: "vrf_contract",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "cloover::wheel::events::Events::ProtocolFeeBpUpdated",
    kind: "struct",
    members: [
      {
        name: "protocol_fee_bp",
        type: "core::integer::u16",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "cloover::wheel::events::Events::ProtocolFeeRecipientUpdated",
    kind: "struct",
    members: [
      {
        name: "protocol_fee_recipient",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "cloover::wheel::events::Events::RoundDurationUpdated",
    kind: "struct",
    members: [
      {
        name: "round_duration",
        type: "core::integer::u64",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "cloover::wheel::events::Events::PricePerTicketUpdated",
    kind: "struct",
    members: [
      {
        name: "price_per_ticket",
        type: "core::integer::u256",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "cloover::wheel::events::Events::OutflowAllowedToggled",
    kind: "struct",
    members: [{ name: "outflow_allowed", type: "core::bool", kind: "data" }],
  },
  {
    type: "event",
    name: "cloover::wheel::events::Events::MaximumNumberOfParticipantsPerRoundUpdated",
    kind: "struct",
    members: [
      {
        name: "maximum_number_of_participants_per_round",
        type: "core::integer::u32",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "cloover::wheel::events::Events::MaximumParticipantTicketsPerRoundUpdated",
    kind: "struct",
    members: [
      {
        name: "maximum_participant_tickets_per_round",
        type: "core::integer::u32",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "cloover::wheel::events::Events::MaximumNumberOfDepositsPerRoundUpdated",
    kind: "struct",
    members: [
      {
        name: "maximum_number_of_deposits_per_round",
        type: "core::integer::u32",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "cloover::wheel::events::Events::RoundStatusUpdated",
    kind: "struct",
    members: [
      { name: "round_id", type: "core::integer::u32", kind: "data" },
      {
        name: "status",
        type: "cloover::wheel::types::RoundStatus",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "cloover::wheel::events::Events::Deposited",
    kind: "struct",
    members: [
      {
        name: "depositor",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "token",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      { name: "round_id", type: "core::integer::u32", kind: "data" },
      { name: "amount", type: "core::integer::u256", kind: "data" },
      {
        name: "start_ticket_index",
        type: "core::integer::u32",
        kind: "data",
      },
      {
        name: "tickets_count",
        type: "core::integer::u32",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "cloover::wheel::events::Events::DepositsWithdrawn",
    kind: "struct",
    members: [
      {
        name: "depositor",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "withdrawal_calldata",
        type: "core::array::Array::<cloover::wheel::types::WithdrawalCallData>",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "cloover::wheel::events::Events::RoundCutoffTimeSet",
    kind: "struct",
    members: [
      { name: "round_id", type: "core::integer::u32", kind: "data" },
      { name: "cutoff_time", type: "core::integer::u64", kind: "data" },
    ],
  },
  {
    type: "event",
    name: "cloover::wheel::events::Events::RoundsCancelled",
    kind: "struct",
    members: [
      {
        name: "starting_round_id",
        type: "core::integer::u32",
        kind: "data",
      },
      {
        name: "number_of_rounds",
        type: "core::integer::u32",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "cloover::wheel::events::Events::ProtocolFeeTransferred",
    kind: "struct",
    members: [
      { name: "round_id", type: "core::integer::u32", kind: "data" },
      {
        name: "recipient",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "token",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      { name: "amount", type: "core::integer::u256", kind: "data" },
    ],
  },
  {
    type: "event",
    name: "cloover::wheel::events::Events::PrizeClaimed",
    kind: "struct",
    members: [
      {
        name: "token",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "winner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "round_ids",
        type: "core::array::Array::<core::integer::u32>",
        kind: "data",
      },
      {
        name: "prizes",
        type: "core::array::Array::<core::integer::u256>",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "cloover::wheel::events::Events::WinnerDrawn",
    kind: "struct",
    members: [
      { name: "round_id", type: "core::integer::u32", kind: "data" },
      {
        name: "random_value",
        type: "core::integer::u256",
        kind: "data",
      },
      {
        name: "winning_ticket",
        type: "core::integer::u32",
        kind: "data",
      },
      {
        name: "winner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
    kind: "struct",
    members: [
      {
        name: "previous_owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "new_owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
    kind: "struct",
    members: [
      {
        name: "previous_owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "new_owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
    kind: "enum",
    variants: [
      {
        name: "OwnershipTransferred",
        type: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
        kind: "nested",
      },
      {
        name: "OwnershipTransferStarted",
        type: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
        kind: "nested",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_security::reentrancyguard::ReentrancyGuardComponent::Event",
    kind: "enum",
    variants: [],
  },
  {
    type: "event",
    name: "openzeppelin_security::pausable::PausableComponent::Paused",
    kind: "struct",
    members: [
      {
        name: "account",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_security::pausable::PausableComponent::Unpaused",
    kind: "struct",
    members: [
      {
        name: "account",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_security::pausable::PausableComponent::Event",
    kind: "enum",
    variants: [
      {
        name: "Paused",
        type: "openzeppelin_security::pausable::PausableComponent::Paused",
        kind: "nested",
      },
      {
        name: "Unpaused",
        type: "openzeppelin_security::pausable::PausableComponent::Unpaused",
        kind: "nested",
      },
    ],
  },
  {
    type: "event",
    name: "cloover::wheel::wheel::Wheel::Event",
    kind: "enum",
    variants: [
      {
        name: "ContractDeployed",
        type: "cloover::wheel::events::Events::ContractDeployed",
        kind: "nested",
      },
      {
        name: "VRFUpdated",
        type: "cloover::wheel::events::Events::VRFUpdated",
        kind: "nested",
      },
      {
        name: "ProtocolFeeBpUpdated",
        type: "cloover::wheel::events::Events::ProtocolFeeBpUpdated",
        kind: "nested",
      },
      {
        name: "ProtocolFeeRecipientUpdated",
        type: "cloover::wheel::events::Events::ProtocolFeeRecipientUpdated",
        kind: "nested",
      },
      {
        name: "RoundDurationUpdated",
        type: "cloover::wheel::events::Events::RoundDurationUpdated",
        kind: "nested",
      },
      {
        name: "PricePerTicketUpdated",
        type: "cloover::wheel::events::Events::PricePerTicketUpdated",
        kind: "nested",
      },
      {
        name: "OutflowAllowedToggled",
        type: "cloover::wheel::events::Events::OutflowAllowedToggled",
        kind: "nested",
      },
      {
        name: "MaximumNumberOfParticipantsPerRoundUpdated",
        type: "cloover::wheel::events::Events::MaximumNumberOfParticipantsPerRoundUpdated",
        kind: "nested",
      },
      {
        name: "MaximumParticipantTicketsPerRoundUpdated",
        type: "cloover::wheel::events::Events::MaximumParticipantTicketsPerRoundUpdated",
        kind: "nested",
      },
      {
        name: "MaximumNumberOfDepositsPerRoundUpdated",
        type: "cloover::wheel::events::Events::MaximumNumberOfDepositsPerRoundUpdated",
        kind: "nested",
      },
      {
        name: "RoundStatusUpdated",
        type: "cloover::wheel::events::Events::RoundStatusUpdated",
        kind: "nested",
      },
      {
        name: "Deposited",
        type: "cloover::wheel::events::Events::Deposited",
        kind: "nested",
      },
      {
        name: "DepositsWithdrawn",
        type: "cloover::wheel::events::Events::DepositsWithdrawn",
        kind: "nested",
      },
      {
        name: "RoundCutoffTimeSet",
        type: "cloover::wheel::events::Events::RoundCutoffTimeSet",
        kind: "nested",
      },
      {
        name: "RoundsCancelled",
        type: "cloover::wheel::events::Events::RoundsCancelled",
        kind: "nested",
      },
      {
        name: "ProtocolFeeTransferred",
        type: "cloover::wheel::events::Events::ProtocolFeeTransferred",
        kind: "nested",
      },
      {
        name: "PrizeClaimed",
        type: "cloover::wheel::events::Events::PrizeClaimed",
        kind: "nested",
      },
      {
        name: "WinnerDrawn",
        type: "cloover::wheel::events::Events::WinnerDrawn",
        kind: "nested",
      },
      {
        name: "OwnableEvent",
        type: "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
        kind: "flat",
      },
      {
        name: "ReentrancyGuardEvent",
        type: "openzeppelin_security::reentrancyguard::ReentrancyGuardComponent::Event",
        kind: "flat",
      },
      {
        name: "PausableEvent",
        type: "openzeppelin_security::pausable::PausableComponent::Event",
        kind: "flat",
      },
    ],
  },
] as const;

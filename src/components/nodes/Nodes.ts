import {Node} from "reactflow"
import SystemNode from "./SystemNode.tsx"
import EventNode from "./EventNode.tsx"
import AndNode from "./AndNode.tsx"
import OrNode from "./OrNode.tsx"
import XorNode from "./XorNode.tsx"
import FdepNode from "./FdepNode.tsx"
import PAndNode from "./PAndNode.tsx"
import SpareNode from "./SpareNode.tsx"

export type CommonNodeData = {
    label: string;
    failed: null | number;
    /**
     * Which types of nodes should be able to connect to this handle
     */
}

export type SystemNodeData = CommonNodeData
export type EventNodeData = {
    isSpare: boolean;
	beingUsedBy: string;
} & CommonNodeData

export type AndNodeData = CommonNodeData
export type OrNodeData = CommonNodeData
export type XorNodeData = CommonNodeData

export type PAndNodeData = CommonNodeData
export type FdepNodeData = CommonNodeData
export type SpareNodeData = CommonNodeData

export enum NodeType {
    SYSTEM_NODE = "SYSTEM_NODE",
    EVENT_NODE = "EVENT_NODE",

    AND_NODE = "AND_NODE",
    OR_NODE = "OR_NODE",
    XOR_NODE = "XOR_NODE",

    PAND_NODE = "PAND_NODE",
    FDEP_NODE = "FDEP_NODE",
    SPARE_NODE = "SPARE_NODE",
}

export interface SystemNodeType extends Node<SystemNodeData> {
    type: NodeType.SYSTEM_NODE;
}

export interface EventNodeType extends Node<EventNodeData> {
    type: NodeType.EVENT_NODE;
}

export interface AndNodeType extends Node<AndNodeData> {
    type: NodeType.AND_NODE;
}

export interface OrNodeType extends Node<OrNodeData> {
    type: NodeType.OR_NODE;
}

export interface XorNodeType extends Node<XorNodeData> {
    type: NodeType.XOR_NODE;
}

export interface PAndNodeType extends Node<PAndNodeData> {
    type: NodeType.PAND_NODE;
}

export interface FdepNodeType extends Node<FdepNodeData> {
    type: NodeType.FDEP_NODE;
}

export interface SpareNodeType extends Node<SpareNodeData> {
    type: NodeType.SPARE_NODE;
}

export interface UnknownNodeType extends Node<any> {
    type: undefined
}

export type NodeUnion = SystemEventNodeUnion | GateNodeUnion;
export type SystemEventNodeUnion = SystemNodeType | EventNodeType | UnknownNodeType;
export type GateNodeUnion = AndNodeType | OrNodeType | XorNodeType | PAndNodeType | FdepNodeType | SpareNodeType | UnknownNodeType;

/**
 * A map with the node type as key and the allowed handle connection types as value.
 * The key is part of the handle id. use {@link parseHandleId} to get the handle type.
 */
export const handleRestrictionsMap: {[key: string]: {[key: string]: NodeType[]} | undefined} = {
    [NodeType.SYSTEM_NODE]: undefined,
    [NodeType.EVENT_NODE]: undefined,

    [NodeType.AND_NODE]: undefined,
    [NodeType.OR_NODE]: undefined,
    [NodeType.XOR_NODE]: undefined,

    [NodeType.PAND_NODE]: undefined,
    [NodeType.FDEP_NODE]: {
        "dependent": [NodeType.EVENT_NODE]
    },
    [NodeType.SPARE_NODE]: {
        "spare": [NodeType.EVENT_NODE]
    },
}

export const nodeElementsMap = {
    [NodeType.SYSTEM_NODE]: SystemNode,
    [NodeType.EVENT_NODE]: EventNode,

    [NodeType.AND_NODE]: AndNode,
    [NodeType.OR_NODE]: OrNode,
    [NodeType.XOR_NODE]: XorNode,

    [NodeType.PAND_NODE]: PAndNode,
    [NodeType.FDEP_NODE]: FdepNode,
    [NodeType.SPARE_NODE]: SpareNode,
}
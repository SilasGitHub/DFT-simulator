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
}

export type SystemNodeData = CommonNodeData
export type EventNodeData = {
    isSpare: boolean;
	beingUsedBy: string;
} & CommonNodeData

export type AndNodeData = CommonNodeData
export type OrNodeData = CommonNodeData
export type XorNodeData = CommonNodeData

export type FdepNodeData = CommonNodeData
export type PAndNodeData = CommonNodeData
export type SpareNodeData = CommonNodeData

export enum NodeType {
    SYSTEM_NODE = "systemNode",
    EVENT_NODE = "eventNode",

    AND_NODE = "andNode",
    OR_NODE = "orNode",
    XOR_NODE = "xorNode",

    FDEP_NODE = "fdepNode",
    PAND_NODE = "pandNode",
    SPARE_NODE = "spareNode",
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

export interface FdepNodeType extends Node<FdepNodeData> {
    type: NodeType.FDEP_NODE;
}

export interface PAndNodeType extends Node<PAndNodeData> {
    type: NodeType.PAND_NODE;
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

export const nodeMap = {
    [NodeType.SYSTEM_NODE]: SystemNode,
    [NodeType.EVENT_NODE]: EventNode,

    [NodeType.AND_NODE]: AndNode,
    [NodeType.OR_NODE]: OrNode,
    [NodeType.XOR_NODE]: XorNode,

    [NodeType.FDEP_NODE]: FdepNode,
    [NodeType.PAND_NODE]: PAndNode,
    [NodeType.SPARE_NODE]: SpareNode,
}
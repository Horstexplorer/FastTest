import {ISpeedtestConfiguration} from "../speedtest/config/speedtest-configuration.ts";
import {generateRandomData} from "../misc/generator.ts";
import {AssetConfiguration} from "../speedtest-assets/asset-configuration.ts";
import {getPathToAsset} from "../speedtest-assets/asset-index.ts";
import {ISpeedtestUserConfiguration} from "./user-configuration.ts";
import {DataUnit} from "../misc/data-unit-conversion.ts";

export function buildSpeedtestConfigurationFrom(assetConfiguration: AssetConfiguration, persisted: ISpeedtestUserConfiguration): ISpeedtestConfiguration {
    const noPayloadAsset = assetConfiguration.assetWithNoPayload!
    const downloadAsset = assetConfiguration.assetWithPayloadCloseTo(persisted.download.payloadByteSize)!
    return {
        latency: {
            url: getPathToAsset(noPayloadAsset),
            maxRequests: persisted.latency.maxRequests,
            maxDuration: persisted.latency.maxDuration
        },
        download: {
            url: getPathToAsset(downloadAsset),
            maxRequests: persisted.download.maxRequests,
            maxDuration: persisted.download.maxDuration
        },
        upload: {
            url: getPathToAsset(noPayloadAsset),
            maxRequests: persisted.upload.maxRequests,
            maxDuration: persisted.upload.maxDuration,
            payloadProvider: () => new Blob([generateRandomData(persisted.upload.payloadByteSize)], { type: "application/octet-stream"})
        }
    }
}

export function buildDefaultSpeedtestUserConfiguration(assetConfiguration: AssetConfiguration): ISpeedtestUserConfiguration {
    const payloadAsset = assetConfiguration.assetWithPayloadCloseTo(0)!
    return {
        display: {
            useSIUnits: false,
            useByteUnits: true,
            useFixedUnit: getDefaultDataUnit(false, true).id
        },
        latency: {
            enabled: true,
            maxRequests: 10,
            maxDuration: 3_000
        },
        download: {
            enabled: true,
            payloadByteSize: payloadAsset.expected_payload_bytes!,
            maxRequests: 25,
            maxDuration: 15_000
        },
        upload: {
            enabled: true,
            payloadByteSize: payloadAsset.expected_payload_bytes!,
            maxRequests: 25,
            maxDuration: 15_000,
        }
    }
}

export function getDefaultDataUnit(useSi: boolean, useByte: boolean): DataUnit {
    if (useSi && useByte) {
        return DataUnit.MEGA_BYTE
    } else if (useSi) {
        return DataUnit.MEGA_BIT
    } else if (useByte) {
        return DataUnit.MEBI_BYTE
    } else {
        return DataUnit.MEBI_BIT
    }
}
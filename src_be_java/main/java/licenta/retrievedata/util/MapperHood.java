package licenta.retrievedata.util;

import licenta.retrievedata.entitites.Device;
import licenta.retrievedata.entitites.RetrievedData;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class MapperHood {

    public Device convertToHood(RetrievedData retrievedData){
        Device newDevice = new Device();
        newDevice.setName(retrievedData.getTitle());
        newDevice.setCategory(takeCategory(retrievedData.getDescription()));
        newDevice.setPrice(BigDecimal.valueOf(retrievedData.getPrice()));
        newDevice.setUrl(retrievedData.getUrl());
        newDevice.setImageUrl(retrievedData.getImageUrl());
        newDevice.setConsumption(extractEnergyConsumption(retrievedData.getDescription()));
        newDevice.setConsumptionClass(extractConsumptionClass(retrievedData.getTitle()));
        newDevice.setHeight(takeHeight(retrievedData.getDescription()));
        newDevice.setWidth(takeWidth(retrievedData.getDescription()));
        newDevice.setLength(takeLength(retrievedData.getDescription()));
        return newDevice;

    }

    private String extractConsumptionClass(String input){

        String patternString = "Clasa eficienta energetica\\s+([^\n]+)";
        Pattern pattern = Pattern.compile(patternString);
        Matcher matcher = pattern.matcher(input);

        if (matcher.find()) {
            return matcher.group(1).trim();
        } else {
            return "invalid clasa";
        }

    }

    private double extractEnergyConsumption (String input){

        String energyConsumptionPatternString = "Consum energie \\(kW/an\\)\\s*(\\d+\\.?\\d*)";
        String powerPatternString = "Putere \\(W\\)\\s*(\\d+\\.?\\d*)";

        Pattern energyConsumptionPattern = Pattern.compile(energyConsumptionPatternString, Pattern.CASE_INSENSITIVE);
        Pattern powerPattern = Pattern.compile(powerPatternString, Pattern.CASE_INSENSITIVE);

        Matcher energyConsumptionMatcher = energyConsumptionPattern.matcher(input);

        if (energyConsumptionMatcher.find()) {
            String numericalValue = energyConsumptionMatcher.group(1);
            double energyConsumptionInKWh = Double.parseDouble(numericalValue);
            return energyConsumptionInKWh;
        }

        Matcher powerMatcher = powerPattern.matcher(input);

        if (powerMatcher.find()) {
            String numericalValue = powerMatcher.group(1);

            double powerInWatts = Double.parseDouble(numericalValue);
            double energyConsumptionInKWh = powerInWatts / 100.0;

            return energyConsumptionInKWh;
        }

        return 93.0;
    }

    private String takeCategory(String input){

        String patternString = "Tip hota\\s*(\\S.+)";

        Pattern pattern = Pattern.compile(patternString, Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(input);
        if (matcher.find()) {
            return "Hota " + matcher.group(1).trim();
        }

        return "invalid category";

    }

    private static Double takeHeight(String input) {
        String patternString = "Dimensiuni \\(L x A x I cm\\)\\s+(\\d+\\.?\\d*)\\s*x\\s*(\\d+\\.?\\d*)(?:\\s*x\\s*(\\d+\\.?\\d*))?";
        Pattern pattern = Pattern.compile(patternString);
        Matcher matcher = pattern.matcher(input);

        if (matcher.find() && matcher.group(3) != null) {
            return Double.parseDouble(matcher.group(3));
        } else {
            return 0.0;
        }
    }

    private static Double takeWidth(String input) {
        String patternString = "Dimensiuni \\(L x A x I cm\\)\\s+(\\d+\\.?\\d*)\\s*x\\s*(\\d+\\.?\\d*)(?:\\s*x\\s*(\\d+\\.?\\d*))?";
        Pattern pattern = Pattern.compile(patternString);
        Matcher matcher = pattern.matcher(input);

        if (matcher.find()) {
            return Double.parseDouble(matcher.group(2));
        } else {
            return 0.0;
        }
    }

    private static Double takeLength(String input) {
        String patternString = "Dimensiuni \\(L x A x I cm\\)\\s+(\\d+\\.?\\d*)\\s*x\\s*(\\d+\\.?\\d*)(?:\\s*x\\s*(\\d+\\.?\\d*))?";
        Pattern pattern = Pattern.compile(patternString);
        Matcher matcher = pattern.matcher(input);

        if (matcher.find()) {
            return Double.parseDouble(matcher.group(1));
        } else {
            return 0.0;
        }
    }
}

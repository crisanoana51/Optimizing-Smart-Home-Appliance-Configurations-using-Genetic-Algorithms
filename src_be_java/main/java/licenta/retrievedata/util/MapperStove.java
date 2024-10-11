package licenta.retrievedata.util;

import licenta.retrievedata.entitites.Device;
import licenta.retrievedata.entitites.RetrievedData;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


@Service
public class MapperStove {
    public Device convertToStove(RetrievedData retrievedData){
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

        String powerPatternString = "Putere \\(W\\)\\s*(?:Cuptor[:\\s]*)?(\\d+\\.?\\d*)";
        String tensionPatternString = "Tensiune \\(V\\)\\s*(\\d+\\.?\\d*)";

        Pattern powerPattern = Pattern.compile(powerPatternString, Pattern.CASE_INSENSITIVE);
        Matcher powerMatcher = powerPattern.matcher(input);
        if (powerMatcher.find()) {
            double powerInWatts = Double.parseDouble(powerMatcher.group(1));
            double energyConsumptionInKWh = powerInWatts / 1000.0;
            return energyConsumptionInKWh;
        }

        Pattern tensionPattern = Pattern.compile(tensionPatternString, Pattern.CASE_INSENSITIVE);
        Matcher tensionMatcher = tensionPattern.matcher(input);
        if (tensionMatcher.find()) {
            double tensionInVolts = Double.parseDouble(tensionMatcher.group(1));
            double energyConsumptionInKWh = tensionInVolts * 10 / 1000.0;
            return energyConsumptionInKWh;
        }
        return 3.0;
    }

    private String takeCategory(String input){

        String patternString = "Tip alimentare\\s*(\\S.+)";

        Pattern pattern = Pattern.compile(patternString, Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(input);
        if (matcher.find()) {
            return "Aragaz " + matcher.group(1).trim();
        }

        return "invalid category";

    }

    private Double takeHeight(String input){
        String patternString = "Dimensiuni \\(L x A x I cm\\)\\s+(\\d+\\.?\\d*)\\s*x\\s*(\\d+\\.?\\d*)\\s*x\\s*(\\d+\\.?\\d*)";
        Pattern pattern = Pattern.compile(patternString);
        Matcher matcher = pattern.matcher(input);

        if (matcher.find()) {
            return Double.parseDouble(matcher.group(3));
        } else {
            return 0.0;
        }

    }

    private Double takeWidth(String input){
        String patternString = "Dimensiuni \\(L x A x I cm\\)\\s+(\\d+\\.?\\d*)\\s*x\\s*(\\d+\\.?\\d*)\\s*x\\s*(\\d+\\.?\\d*)";
        Pattern pattern = Pattern.compile(patternString);
        Matcher matcher = pattern.matcher(input);

        if (matcher.find()) {
            return Double.parseDouble(matcher.group(2));
        } else {
            return 0.0;
        }

    }

    private Double takeLength(String input){
        String patternString = "Dimensiuni \\(L x A x I cm\\)\\s+(\\d+\\.?\\d*)\\s*x\\s*(\\d+\\.?\\d*)\\s*x\\s*(\\d+\\.?\\d*)";
        Pattern pattern = Pattern.compile(patternString);
        Matcher matcher = pattern.matcher(input);

        if (matcher.find()) {
            return Double.parseDouble(matcher.group(1));
        } else {
            return 0.0;
        }

    }
}

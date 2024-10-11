package licenta.retrievedata.util;
import licenta.retrievedata.entitites.Device;
import licenta.retrievedata.entitites.RetrievedData;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


@Service
public class MapperOven {

    public Device convertToOven(RetrievedData retrievedData){
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

        String patternString1 = "Consum de energie \\(kW/h\\)\\s*(?:(?:Mod conventional:|Conventional:)?\\s*(\\d+\\.?\\d*);?\\s*(?:Mod aer fortat:|Cu ventilatie:|Cu ventilare:)?\\s*(\\d+\\.?\\d*))?";

        Pattern pattern1 = Pattern.compile(patternString1, Pattern.CASE_INSENSITIVE);
        Matcher matcher1 = pattern1.matcher(input);
        if (matcher1.find()) {

            if (matcher1.group(1) != null) {
                return Double.parseDouble(matcher1.group(1));
            }

            if (matcher1.group(2) != null) {
                return Double.parseDouble(matcher1.group(2));
            }
        }

        String patternString2 = "Putere \\(W\\)\\s*(\\d+\\.?\\d*)";

        Pattern pattern2 = Pattern.compile(patternString2, Pattern.CASE_INSENSITIVE);
        Matcher matcher2 = pattern2.matcher(input);
        if (matcher2.find()) {
            double powerInWatts = Double.parseDouble(matcher2.group(1));
            double energyConsumptionInKWh = powerInWatts / 1000.0;
            return energyConsumptionInKWh;
        }

        return 1.0;
    }

    private String takeCategory(String input){

        String patternString = "Tip cuptor\\s*(\\S.+)";

        Pattern pattern = Pattern.compile(patternString, Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(input);
        if (matcher.find()) {
            return "Cuptor Incorporabil " + matcher.group(1).trim();
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
